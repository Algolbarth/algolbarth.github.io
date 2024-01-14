
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    class Camera {
        x = 0;
        y = 0;
        width;
        height;

        init = function (y, ctx) {
            this.y = y;
            ctx.translate(0, -y);
        };

        reset = function (ctx) {
            ctx.translate(this.x, this.y);
            this.x = 0;
            this.y = 0;
        };

        fix = function (System, canvas, ctx) {
            if (System.page.name == "game") {
                let move_x = 0;
                if (System.character.left) {
                    move_x -= System.character.speed;
                }
                if (System.character.right) {
                    move_x += System.character.speed;
                }
                if ((move_x > 0 && System.character.x + System.character.width / 2 + canvas.width / 2 > this.x + this.width) || (move_x < 0 && System.character.x - System.character.width / 2 - canvas.width / 2 < this.x)) {
                    this.x += move_x;
                    ctx.translate(-move_x, 0);
                }
                if (this.x < 0) {
                    ctx.translate(this.x, 0);
                    this.x = 0;
                }
                else if (this.x + this.width > System.map.width) {
                    ctx.translate(this.x + this.width - System.map.width, 0);
                    this.x = System.map.width - this.width;
                }
            
                if ((System.character.move_y > 0 && System.character.y + System.character.height / 2 + canvas.height / 2 > this.y + this.height) || (System.character.move_y < 0 && System.character.y - System.character.height / 2 - canvas.height / 2 < this.y)) {
                    this.y += System.character.move_y;
                    ctx.translate(0, -System.character.move_y);
                }
                if (this.y < 0) {
                    ctx.translate(0, this.y);
                    this.y = 0;
                }
                else if (this.y + this.height > System.map.height) {
                    ctx.translate(0, this.y + this.height - System.map.height);
                    this.y = System.map.height - this.height;
                }
            }
        };
    }

    function goMenu (System) {
        System.page = {
            name : "menu",
            up : false,
            down : false,
            select : 0,
            timer : 0,
        };
    }
    function menu (System) {
        if (System.page.timer == 0) {
            if (System.page.up && System.page.select > 0) {
                System.page.select--;
                System.page.timer = 6;
            }
            if (System.page.down && System.page.select < System.maps.instance.length - 1) {
                System.page.select++;
                System.page.timer = 6;
            }
        }
        else {
            System.page.timer--;
        }
        
        System.empty("#add8e6");

        let i = 0;
        for (const map of System.maps.instance) {
            if (System.page.select == i) {
                drawSelect$2(System, map, 50, 50 + i*100);
            }
            else {
                drawButton$2(System, map, 50, 50 + i*100);
            }
            i++;
        }
    }
    function drawButton$2 (System, map, x, y) {
        System.ctx.fillStyle = "#87cefa";
        System.ctx.fillRect(x, y, 800, 80);
        System.ctx.fillStyle = "#000000";
        System.ctx.font = "25px sans-serif";
        System.ctx.fillText(map.name, x + 10, y + 50);
    }
    function drawSelect$2 (System, map, x, y) {
        System.ctx.lineWidth = 5;
        System.ctx.fillStyle = "#87cefa";
        System.ctx.fillRect(x, y, 800, 80);
        System.ctx.strokeStyle = "#000000";
        System.ctx.strokeRect(x+2, y+2, 800-2, 80-2);
        System.ctx.fillStyle = "#000000";
        System.ctx.font = "25px sans-serif";
        System.ctx.fillText(map.name, x + 10, y + 50);
        System.ctx.lineWidth = 1;
    }
    function keyUpMenu (System, e) {
        if (e.keyCode == 38) {
            System.page.up = false;
        }
        if (e.keyCode == 40) {
            System.page.down = false;
        }
    }
    function keyDownMenu (System, e) {
        if (e.keyCode == 38) {
            System.page.up = true;
        }
        if (e.keyCode == 40) {
            System.page.down = true;
        }
        if (e.keyCode == 32) {
            System.newGame(System.maps.instance[System.page.select].name);
        }
    }

    function goLoose (System) {
        System.camera.reset(System.ctx);
        System.page = {
            name : "loose",
            left : false,
            right : false,
            select : "retry",
            timer : 0,
        };
    }
    function loose (System) {
        if (System.page.timer == 0) {
            if (System.page.left && System.page.select == "select") {
                System.page.select = "retry";
                System.page.timer = 6;
            }
            if (System.page.right && System.page.select == "retry") {
                System.page.select = "select";
                System.page.timer = 6;
            }
        }
        else {
            System.page.timer--;
        }
        
        System.empty("#add8e6");

        if (System.page.select == "retry") {
            drawSelect$1(System, "Retry", System.canvas.width/2 - 450, System.canvas.height/2);
            drawButton$1(System, "Level Selection", System.canvas.width/2 + 50, System.canvas.height/2);
        }
        else {
            drawButton$1(System, "Retry", System.canvas.width/2 - 450, System.canvas.height/2);
            drawSelect$1(System, "Level Selection", System.canvas.width/2 + 50, System.canvas.height/2);
        }
    }
    function drawButton$1 (System, name, x, y) {
        System.ctx.fillStyle = "#87cefa";
        System.ctx.fillRect(x, y, 400, 80);
        System.ctx.fillStyle = "#000000";
        System.ctx.font = "25px sans-serif";
        System.ctx.fillText(name, x + 400/2 - 25*name.length/4, y + 50);
    }
    function drawSelect$1 (System, name, x, y) {
        System.ctx.lineWidth = 5;
        System.ctx.fillStyle = "#87cefa";
        System.ctx.fillRect(x, y, 400, 80);
        System.ctx.strokeStyle = "#000000";
        System.ctx.strokeRect(x+2, y+2, 400-2, 80-2);
        System.ctx.fillStyle = "#000000";
        System.ctx.font = "25px sans-serif";
        System.ctx.fillText(name, x + 400/2 - 25*name.length/4, y + 50);
        System.ctx.lineWidth = 1;
    }
    function keyUpLoose (System, e) {
        if (e.keyCode == 37) {
            System.page.left = false;
        }
        if (e.keyCode == 39) {
            System.page.right = false;
        }
    }
    function keyDownLoose (System, e) {
        if (e.keyCode == 37) {
            System.page.left = true;
        }
        if (e.keyCode == 39) {
            System.page.right = true;
        }
        if (e.keyCode == 32) {
            if (System.page.select == "retry") {
                System.retry();
            }
            else {
                goMenu(System);
            }
        }
    }

    class Character {
        nature = "character";
        x = 0;
        y = 0;
        height = 35;
        width = 25;
        speed = 3;
        jumping = false;
        fall = false;
        left = false;
        right = false;
        can_jump = false;
        move_y = 10;
        immune = 0;
        type = "little";

        move = function (System) {
            let listObject = [];
            for (let n = 0; n < System.map.objects.length; n++) {
                listObject.push(System.map.objects[n]);
            }
            let listEntity = [];
            for (let n = 0; n < System.map.entities.length; n++) {
                listEntity.push(System.map.entities[n]);
            }
        
            let move_x = 0;
            if (System.character.left) {
                move_x -= System.character.speed;
            }
            if (System.character.right) {
                move_x += System.character.speed;
            }
            System.character.x += move_x;
            for (let n = 0; n < listObject.length; n++) {
                if (System.checkCollision(System.character, listObject[n])) {
                    listObject[n].collision_x(System.character, move_x);
                }
            }
            for (let n = 0; n < listEntity.length; n++) {
                if (System.checkCollision(System.character, listEntity[n])) {
                    listEntity[n].collision_x(System.character, move_x);
                }
            }
            if (System.character.x < 0) {
                System.character.x = 0;
            }
            else if (System.character.x + System.character.width > System.map.width) {
                System.character.x = System.map.width - System.character.width;
            }
        
            if (System.character.jumping && System.character.can_jump) {
                System.character.can_jump = false;
                System.character.move_y = -12;
            }
            System.character.move_y += System.gravity;
            System.character.y += System.character.move_y;
            for (let n = 0; n < listObject.length; n++) {
                if (System.checkCollision(System.character, listObject[n])) {
                    listObject[n].collision_y(System.character);
                }
            }
            for (let n = 0; n < listEntity.length; n++) {
                if (System.checkCollision(System.character, listEntity[n])) {
                    listEntity[n].collision_y(System.character);
                }
            }
            if (System.character.y > System.map.height) {
                this.death(System);
            }
        
            for (let n = 0; n < listObject.length; n++) {
                if (System.checkCollision(System.character, listObject[n])) {
                    listObject[n].collision(System.character);
                }
            }
            for (let n = 0; n < listEntity.length; n++) {
                if (System.checkCollision(System.character, listEntity[n])) {
                    listEntity[n].collision(System.character);
                }
            }
        };

        damage = function (System) {
            if (this.immune == 0) {
                if (this.type != "little") {
                    this.height = 35;
                    this.y += 15;
                    this.speed = 3;
                    this.type = "little";
                    this.immune = 150;
                }
                else {
                    this.death(System);
                }
            }
        };

        death = function (System) {
            goLoose(System);
        };

        draw = function (ctx) {
            switch (this.type) {
                case "little":
                    ctx.fillStyle = "#EE0000";
                    ctx.fillRect(this.x + 3, this.y, 20, 5);
                    ctx.fillRect(this.x, this.y + 15, 25, 15);
                    ctx.fillStyle = "#FFE4B5";
                    ctx.fillRect(this.x + 3, this.y + 5, 20, 10);
                    ctx.fillStyle = "#1E90FF";
                    ctx.fillRect(this.x + 5, this.y + 15, 15, 8);
                    ctx.fillStyle = "#A0522D";
                    ctx.fillRect(this.x, this.y + 30, 10, 5);
                    ctx.fillRect(this.x + 15, this.y + 30, 10, 5);
                    break;
                case "tall":
                    ctx.fillStyle = "#EE0000";
                    ctx.fillRect(this.x + 3, this.y, 20, 5);
                    ctx.fillRect(this.x, this.y + 15, 25, 30);
                    ctx.fillStyle = "#FFE4B5";
                    ctx.fillRect(this.x + 3, this.y + 5, 20, 10);
                    ctx.fillStyle = "#1E90FF";
                    ctx.fillRect(this.x + 5, this.y + 15, 15, 8);
                    ctx.fillStyle = "#A0522D";
                    ctx.fillRect(this.x, this.y + 45, 10, 5);
                    ctx.fillRect(this.x + 15, this.y + 45, 10, 5);
                    break;
                case "speed":
                    ctx.fillStyle = "#DDDD00";
                    ctx.fillRect(this.x + 3, this.y, 20, 5);
                    ctx.fillRect(this.x, this.y + 15, 25, 30);
                    ctx.fillStyle = "#FFE4B5";
                    ctx.fillRect(this.x + 3, this.y + 5, 20, 10);
                    ctx.fillStyle = "#1E90FF";
                    ctx.fillRect(this.x + 5, this.y + 15, 15, 8);
                    ctx.fillStyle = "#A0522D";
                    ctx.fillRect(this.x, this.y + 45, 10, 5);
                    ctx.fillRect(this.x + 15, this.y + 45, 10, 5);
                    break;
            }
        };
    }

    function goGame (System) {
        System.page = {
            name : "game",
            frame : 0,
        };
        System.camera.width = System.canvas.width;
    	System.camera.height = System.canvas.height;
    }
    function game (System) {
        System.page.frame++;
        System.character.move(System);
        for (const entity of System.map.entities) {
            entity.move();
        }

        background(System);

        for (const object of System.map.objects) {
            object.draw(System.ctx);
        }
        for (const entity of System.map.entities) {
            entity.draw(System.ctx);
        }
        if (System.character.immune > 0) {
            if (Math.floor(System.page.frame) % 4) {
                System.character.draw(System.ctx);
            }
            System.character.immune--;
        }
        else {
            System.character.draw(System.ctx);
        }
        drawScore(System);

        System.camera.fix(System, System.canvas, System.ctx);
    }
    function background (System) {
        System.ctx.clearRect(0, 0, System.map.width, System.map.height);
        System.ctx.fillStyle = System.map.background_color;
        System.ctx.fillRect(System.camera.x, System.camera.y, System.camera.width, System.camera.height);
    }

    function drawScore (System) {
        System.ctx.fillStyle = "#FFD700";
        System.ctx.fillRect(System.camera.x + 5, System.camera.y + 5, 25, 25);
        System.ctx.fillStyle = "#DAA520";
        System.ctx.fillRect(System.camera.x + 15, System.camera.y + 10, 5, 15);

        System.ctx.fillStyle = "#000000";
        System.ctx.font = "25px sans-serif";
        System.ctx.fillText(" x " + System.map.coins, System.camera.x + 30, System.camera.y + 25);
    }
    function keyUpGame (System, e) {
        if (e.keyCode == 37) {
            System.character.left = false;
        }
        if (e.keyCode == 39) {
            System.character.right = false;
        }
        if (e.keyCode == 38) {
            System.character.jumping = false;
        }
        if (e.keyCode == 40) {
            System.character.fall = false;
        }
    }
    function keyDownGame (System, e) {
        if (e.keyCode == 37) {
            System.character.left = true;
        }
        if (e.keyCode == 39) {
            System.character.right = true;
        }
        if (e.keyCode == 38) {
            System.character.jumping = true;
        }
        if (e.keyCode == 40) {
            System.character.fall = true;
        }
    }

    function goWin (System) {
        System.camera.reset(System.ctx);
        System.page = {
            name : "win",
            left : false,
            right : false,
            select : "select",
            timer : 0,
        };
    }
    function win (System) {
        if (System.page.timer == 0) {
            if (System.page.left && System.page.select == "select") {
                System.page.select = "retry";
                System.page.timer = 6;
            }
            if (System.page.right && System.page.select == "retry") {
                System.page.select = "select";
                System.page.timer = 6;
            }
        }
        else {
            System.page.timer--;
        }
        
        System.empty("#add8e6");

        if (System.page.select == "retry") {
            drawSelect(System, "Retry", System.canvas.width/2 - 450, System.canvas.height/2);
            drawButton(System, "Level Selection", System.canvas.width/2 + 50, System.canvas.height/2);
        }
        else {
            drawButton(System, "Retry", System.canvas.width/2 - 450, System.canvas.height/2);
            drawSelect(System, "Level Selection", System.canvas.width/2 + 50, System.canvas.height/2);
        }
    }
    function drawButton (System, name, x, y) {
        System.ctx.fillStyle = "#87cefa";
        System.ctx.fillRect(x, y, 400, 80);
        System.ctx.fillStyle = "#000000";
        System.ctx.font = "25px sans-serif";
        System.ctx.fillText(name, x + 400/2 - 25*name.length/4, y + 50);
    }
    function drawSelect (System, name, x, y) {
        System.ctx.lineWidth = 5;
        System.ctx.fillStyle = "#87cefa";
        System.ctx.fillRect(x, y, 400, 80);
        System.ctx.strokeStyle = "#000000";
        System.ctx.strokeRect(x+2, y+2, 400-2, 80-2);
        System.ctx.fillStyle = "#000000";
        System.ctx.font = "25px sans-serif";
        System.ctx.fillText(name, x + 400/2 - 25*name.length/4, y + 50);
        System.ctx.lineWidth = 1;
    }
    function keyUpWin (System, e) {
        if (e.keyCode == 37) {
            System.page.left = false;
        }
        if (e.keyCode == 39) {
            System.page.right = false;
        }
    }
    function keyDownWin (System, e) {
        if (e.keyCode == 37) {
            System.page.left = true;
        }
        if (e.keyCode == 39) {
            System.page.right = true;
        }
        if (e.keyCode == 32) {
            if (System.page.select == "retry") {
                System.retry();
            }
            else {
                goMenu(System);
            }
        }
    }

    let Object$1 = class Object {
        nature = "object";
        place;
        name;
        x;
        y;
        width;
        height;

        constructor (System) {
            this.System = System;
        }
        
        remove = function () {
            this.System.map.objects.splice(this.place, 1);
            for (let n = this.place; n < this.System.map.objects.length; n++) {
                this.System.map.objects[n].place--;
            }
        }

        collision = function () { };

        collision_x = function (move_x) { };
        
        collision_y = function () { };
    };

    class Solid extends Object$1 {
        collision_x = function (object, move_x) {
            if (move_x > 0) {
                object.x = this.x - object.width;
                if (object.nature == "entity") {
                    object.move_x = -move_x;
                }
            }
            else if (move_x < 0) {
                object.x = this.x + this.width;
                if (object.nature == "entity") {
                    object.move_x = -move_x;
                }
            }
        };

        collision_y = function (object) {
            if (object.move_y > 0) {
                object.y = this.y - object.height;
                object.can_jump = true;
                object.move_y = 0;
            }
            else if (object.move_y < 0) {
                object.y = this.y + this.height;
                object.move_y = 0;
            }
        };
    }

    class Ground extends Solid {
        name = "Ground";

        constructor (System, args) {
            super(System);

            this.x = args[0];
            this.y = args[1];
            this.width = args[2];
            this.height = args[3];
        };
        
        draw = function (ctx) {
            ctx.fillStyle = "#D2691E";
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = "#32CD32";
            ctx.fillRect(this.x, this.y, this.width, 10);
            ctx.beginPath();
            for (let n = 0; n < this.width/25; n++) {
                ctx.moveTo(this.x + n*25, this.y + 10);
                ctx.lineTo(this.x + n*25 + 12.5, this.y + 20);
                ctx.lineTo(this.x + n*25 + 25, this.y + 10);
            }
            ctx.fill();
            ctx.closePath();
        };
    }

    class Brick extends Solid {
        name = "Brick";
        width = 40;
        height = 40;

        constructor (System, args) {
            super(System);

            this.x = args[0];
            this.y = args[1];
        };

        collision_y = function (object) {
            if (object.move_y > 0) {
                object.y = this.y - object.height;
                object.can_jump = true;
                object.move_y = 0;
            }
            else if (object.move_y < 0) {
                object.y = this.y + this.height;
                object.move_y = 0;
                if (object.height == 50) {
                    this.remove();
                }
            }
        };
        
        draw = function (ctx) {
            ctx.fillStyle = "#FF8C00";
            ctx.fillRect(this.x, this.y, 40, 40);
            ctx.fillStyle = "#000000";
            ctx.fillRect(this.x, this.y + 10, 40, 5);
            ctx.fillRect(this.x, this.y + 25, 40, 5);
            ctx.fillRect(this.x + 10, this.y, 5, 10);
            ctx.fillRect(this.x + 25, this.y + 15, 5, 10);
            ctx.fillRect(this.x + 10, this.y + 30, 5, 10);
        };
    }

    class Coin extends Object$1 {
        name = "Coin";
        width = 25;
        height = 25;

        constructor (System, args) {
            super(System);

            this.x = args[0];
            this.y = args[1];
        };

        collision = function (object) {
            if (object.nature == "character") {
                this.remove();
                this.System.map.coins++;
            }
        };
        
        draw = function (ctx) {
            ctx.fillStyle = "#FFD700";
            ctx.fillRect(this.x, this.y, 25, 25);
            ctx.fillStyle = "#DAA520";
            ctx.fillRect(this.x + 10, this.y + 5, 5, 15);
        };
    }

    class BaseFlag extends Solid {
        name = "BaseFlag";
        width = 50;
        height = 50;

        constructor (System, args) {
            super(System);

            this.x = args[0];
            this.y = args[1];
        };
        
        draw = function (ctx) {
            ctx.fillStyle = "#8B4513";
            ctx.fillRect(this.x, this.y + 10, 50, 40);
            for (let n = 0; n < 3; n++) {
                ctx.fillRect(this.x + n * 20, this.y, 10, 10);
            }
        };
    }

    class PoleFlag extends Object$1 {
        name = "PoleFlag";
        width = 12;
        height = 450;

        constructor (System, args) {
            super(System);

            this.x = args[0];
            this.y = args[1];
        };

        collision = function (object) {
            if (object.nature == "character") {
                goWin(this.System);
            }
        };
        
        draw = function (ctx) {
            ctx.fillStyle = "#000000";
            ctx.fillRect(this.x + 3, this.y, 6, 450);
            ctx.fillRect(this.x, this.y, 12, 12);
        };
    }

    class Pipe extends Solid {
        name = "Pipe";
        width = 100;

        constructor (System, args) {
            super(System);

            this.x = args[0];
            this.y = args[1];
            this.height = args[2];
        };
        
        draw = function (ctx) {
            ctx.fillStyle = "#D2691E";
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = "#32CD32";
            ctx.fillRect(this.x, this.y, this.width, 10);
            ctx.beginPath();
            for (let n = 0; n < this.width/25; n++) {
                ctx.fillStyle = "#228B22";
                ctx.fillRect(this.x, this.y, 100, this.height);
                ctx.fillRect(this.x - 10, this.y, 120, 20);
                ctx.fillStyle = "#006400";
                ctx.fillRect(this.x, this.y + 20, 100, 10);
            }
            ctx.fill();
            ctx.closePath();
        };
    }

    class Spike extends Solid {
        name = "Spike";
        width = 25;
        height = 25;
        style = "up";

        constructor (System, args) {
            super(System);

            this.x = args[0];
            this.y = args[1];
            this.style = args[2];
        };

        collision_x = function (object, move_x) {
            if (move_x > 0) {
                object.x = this.x - object.width;
                if (object.nature == "entity") {
                    object.move_x = -move_x;
                }
            }
            else if (move_x < 0) {
                object.x = this.x + this.width;
                if (object.nature == "entity") {
                    object.move_x = -move_x;
                }
            }
            if (object.nature == "character") {
                object.damage(this.System);
            }
        };

        collision_y = function (object) {
            if (object.move_y > 0) {
                object.y = this.y - object.height;
                object.can_jump = true;
                object.move_y = 0;
            }
            else if (object.move_y < 0) {
                object.y = this.y + this.height;
                object.move_y = 0;
            }
            if (object.nature == "character") {
                object.damage(this.System);
            }
        };
        
        draw = function (ctx) {
            ctx.fillStyle = "#808080";
            ctx.beginPath();
            switch (this.style) {
                case "up":
                    ctx.moveTo(this.x, this.y + this.height);
                    ctx.lineTo(this.x + this.width/2, this.y);
                    ctx.lineTo(this.x + this.width, this.y + this.height);
                    break;
                case "down":
                    ctx.moveTo(this.x, this.y);
                    ctx.lineTo(this.x + this.width, this.y);
                    ctx.lineTo(this.x + this.width/2, this.y + this.height);
                    break;
            }
            ctx.fill();
            ctx.closePath();
        };
    }

    class Plateform extends Object$1 {
        name = "Plateform";
        height = 10;

        constructor (System, args) {
            super(System);

            this.x = args[0];
            this.y = args[1];
            this.width = args[2];
        };

        collision_y = function (object) {
            if (object.move_y > 0) {
                if (!object.fall) {
                    object.y = this.y - object.height;
                    object.can_jump = true;
                    object.move_y = 0;
                }
            }
        };
        
        draw = function (ctx) {
            ctx.fillStyle = "#DAA520";
            ctx.fillRect(this.x, this.y, this.width, 10);
            ctx.fillStyle = "#000000";
            for (let n = 1; n < this.width/20; n++) {
                ctx.fillRect(this.x + 20*n, this.y, 2, 10);
            }
        };
    }

    class Thunder extends Object$1 {
        name = "Thunder";
        width = 30;
        height = 30;

        constructor (System, args) {
            super(System);

            this.x = args[0];
            this.y = args[1];
        };

        collision = function (object) {
            if (object.nature == "character" && object.type != "speed") {
                this.remove();
                object.type = "speed";
                object.speed = 5;
                if (object.height == 35) {
                    object.height = 50;
                    object.y -= 15;
                }
            }
        };
        
        draw = function (ctx) {
            ctx.fillStyle = "#FFFF00";
            ctx.beginPath();
            ctx.moveTo(this.x + 15, this.y);
            ctx.lineTo(this.x + 5, this.y + 15);
            ctx.lineTo(this.x + 15, this.y + 15);
            ctx.lineTo(this.x + 10, this.y + 30);
            ctx.lineTo(this.x + 30, this.y + 10);
            ctx.lineTo(this.x + 20, this.y + 10);
            ctx.lineTo(this.x + 25, this.y);
            ctx.fill();
            ctx.closePath();
        };
    }

    class Bumper extends Solid {
        name = "Bumper";
        width = 100;
        height = 20;

        constructor (System, args) {
            super(System);

            this.x = args[0];
            this.y = args[1];
        };

        collision_y = function (object) {
            if (object.move_y > 0) {
                object.y = this.y - object.height;
                if (object.jumping) {
                    object.move_y = -17;
                }
                else if (object.fall) {
                    object.move_y = -7;
                }
                else {
                    object.move_y = -12;
                }
            }
            else if (object.move_y < 0) {
                object.y = this.y + this.height;
                object.move_y = 0;
            }
        };
        
        draw = function (ctx) { 
            ctx.fillStyle = "#FF0000";
            ctx.fillRect(this.x, this.y, 100, 5);
            ctx.fillStyle = "#7F3300";
            ctx.fillRect(this.x, this.y + 5, 100, 10);
            ctx.fillRect(this.x + 10, this.y + 15, 10, 5);
            ctx.fillRect(this.x + 80, this.y + 15, 10, 5);
        };
    }

    var objectsList = /*#__PURE__*/Object.freeze({
        __proto__: null,
        BaseFlag: BaseFlag,
        Brick: Brick,
        Bumper: Bumper,
        Coin: Coin,
        Ground: Ground,
        Pipe: Pipe,
        Plateform: Plateform,
        PoleFlag: PoleFlag,
        Spike: Spike,
        Thunder: Thunder
    });

    class Entity {
        nature = "entity";
        ennemy = false;
        place;
        name;
        x;
        y;
        width;
        height;
        move_x = 0;
        move_y = 0;

        constructor (System) {
            this.System = System;
        };

        remove = function () {
            this.System.map.entities.splice(this.place, 1);
            for (let n = this.place; n < this.System.map.entities.length; n++) {
                this.System.map.entities[n].place--;
            }
        };

        collision = function () { };

        collision_x = function (move_x) { };
        
        collision_y = function () { };

        move = function () {
            let listObject = [];
            for (let n = 0; n < this.System.map.objects.length; n++) {
                listObject.push(this.System.map.objects[n]);
            }
            let listEntity = [];
            for (let n = 0; n < this.System.map.entities.length; n++) {
                if (n != this.place) {
                    listEntity.push(this.System.map.entities[n]);
                }
            }
        
            this.x += this.move_x;
            for (let n = 0; n < listObject.length; n++) {
                if (this.System.checkCollision(this, listObject[n])) {
                    listObject[n].collision_x(this, this.move_x);
                }
            }
            for (let n = 0; n < listEntity.length; n++) {
                if (this.System.checkCollision(this, listEntity[n])) {
                    listEntity[n].collision_x(this, this.move_x);
                }
            }
            if (this.x + this.width < 0) {
                this.remove();
            }
            else if (this.x > this.System.map.width) {
                this.remove();
            }
        
            this.move_y += this.System.gravity;
            this.y += this.move_y;
            for (let n = 0; n < listObject.length; n++) {
                if (this.System.checkCollision(this, listObject[n])) {
                    listObject[n].collision_y(this);
                }
            }
            for (let n = 0; n < listEntity.length; n++) {
                if (this.System.checkCollision(this, listEntity[n])) {
                    listEntity[n].collision_y(this);
                }
            }
            if (this.y > this.System.map.height) {
                this.remove();
            }
        
            for (let n = 0; n < listObject.length; n++) {
                if (this.System.checkCollision(this, listObject[n])) {
                    listObject[n].collision(this);
                }
            }
            for (let n = 0; n < listEntity.length; n++) {
                if (this.System.checkCollision(this, listEntity[n])) {
                    listEntity[n].collision(this);
                }
            }
        };
    }

    class Mushroom extends Entity {
        name = "Mushroom";
        width = 30;
        height = 30;

        constructor (System, args) {
            super(System);

            this.x = args[0];
            this.y = args[1];
        };

        collision = function (object) {
            if (object == this.System.character && object.type == "little") {
                this.remove();
                object.type = "tall";
                object.height = 50;
                object.y -= 15;
            }
        };
        
        draw = function (ctx) {
            ctx.fillStyle = "#FF0000";
            ctx.fillRect(this.x, this.y, 30, 20);
            ctx.fillStyle = "#EEE8AA";
            ctx.fillRect(this.x + 5, this.y + 20, 20, 10);
        };
    }

    class Goumba extends Entity {
        name = "Goumba";
        ennemy = true;
        width = 35;
        height = 35;
        move_x = -1;

        constructor (System, args) {
            super(System);

            this.x = args[0];
            this.y = args[1];
        };

        collision_x = function (object) {
            if (object.nature == "character") {
                object.damage(this.System);
            }
        };

        collision_y = function (object) {
            if (object.move_y > 0) {
                if (object.nature == "character") {
                    object.y = this.y - object.height;
                    object.can_jump = true;
                    object.move_y = -6;
                    this.System.map.ennemy++;
                    this.remove();
                }
            }
            else {
                if (object.nature == "character") {
                    object.damage(this.System);
                }
            }
        };
        
        draw = function (ctx) {
            ctx.fillStyle = "#A0522D";
            ctx.fillRect(this.x, this.y, 35, 22);
            ctx.fillStyle = "#FFE4B5";
            ctx.fillRect(this.x + 5, this.y + 22, 25, 7);
            ctx.fillStyle = "#000000";
            ctx.fillRect(this.x, this.y + 29, 12, 6);
            ctx.fillRect(this.x + 23, this.y + 29, 12, 6);
        };
    }

    var entitiesList = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Goumba: Goumba,
        Mushroom: Mushroom
    });

    let Map$1 = class Map {
        name;
        objects = [];
        entities = [];
        ennemy = 0;
        max_ennemy = 0;
        coins = 0;
        max_coins = 0;
        width = 0;
        height = 0;
        background_color = "#000000";
        System;

        constructor(System) {
            this.System = System;
        };

        addObject = function (name, args) {
            let c = this.System.objects.get(name);
            let o = new c(this.System, args);
            o.place = this.objects.length;
            if (name == "Coin") {
                this.max_coins++;
            }
            this.objects.push(o);
        };

        addEntity = function (name, args) {
            let c = this.System.entities.get(name);
            let o = new c(this.System, args);
            o.place = this.entities.length;
            if (o.ennemy) {
                this.max_ennemy++;
            }
            this.entities.push(o);
        };

        addCoinBrick(x, y) {
            this.addObject("Coin", [x + 7, y + 7]);
            this.addObject("Brick", [x, y]);
        };

        addFlag(x, y) {
            this.addObject("PoleFlag", [x + 19, y]);
            this.addObject("BaseFlag", [x, y + 400]);
        };
        
        addSpikeLine(x, y, number, style="up") {
            for (let i = 0; i < number; i++) {
                this.addObject("Spike", [x + i*25, y, style]);
            }
        };
    };

    class Level_1 extends Map$1 {
        name = "Test";
        background_color = "#AFEEEE";
        width = 2000;
        height = 1500;

        constructor (System) {
            super(System);

            this.addObject("Ground", [0, 1300, 1500, 200]);
            this.addCoinBrick(200, 1150);
            this.addEntity("Mushroom", [205, 1120]);
            this.addObject("Bumper", [400, 1280, 300]);
            this.addObject("Pipe", [500, 1200, 300]);
            this.addObject("Plateform", [610, 1200, 90]);
            this.addObject("Brick", [650, 1050]);
            this.addObject("Thunder", [650, 1020]);
            this.addSpikeLine(600, 1275, 4);
            this.addEntity("Goumba", [800, 1265]);
            this.addFlag(1000, 850);
        };

        init = function () {
            this.System.character.x = 100;
            this.System.character.y = 1150;
            this.System.camera.init(1000, this.System.ctx);
        };
    }

    class Level_2 extends Map$1 {
        name = "New Super Mario Bros";
        background_color = "#AFEEEE";
        width = 9000;
        height = 1500;

        constructor (System) {
            super(System);

            this.addObject("Ground", [0, 1350, 2000, 250]);
            this.addCoinBrick(250, 1200);
            this.addObject("Brick", [350, 1200]);
            this.addEntity("Mushroom", [355, 1170]);
            this.addCoinBrick(390, 1200);
            this.addEntity("Goumba", [500, 1310]);

            this.addObject("Ground", [600, 1300, 150, 105]);
            for (let n=0;n<3;n++) {
                this.addObject("Coin", [550 + 35*n, 1220 - 20*n]);
            }
            this.addObject("Ground", [750, 1225, 150, 155]);
            for (let n=0;n<3;n++) {
                this.addObject("Coin", [700 + 35*n, 1150 - 20*n]);
            }
            this.addCoinBrick(850, 1075);

            for (let n=0;n<2;n++) {
                this.addObject("Brick", [1050 + 80*n, 1200]);
            }
            this.addCoinBrick(1090, 1200);
            this.addCoinBrick(1090, 1075);

            this.addObject("Ground", [1300, 1300, 200, 105]);
            for (let n=0;n<2;n++) {
                this.addObject("Coin", [1335 + 105*n, 1150]);
                this.addObject("Coin", [1370 + 35*n, 1125]);
            }
            this.addEntity("Goumba", [1450, 1260]);

            this.addObject("Pipe", [1650, 1225, 400]);
            this.addSpikeLine(1850, 1325, 2);
            for (let n=0;n<2;n++) {
                this.addObject("Coin", [2015 + 105*n, 1200]);
                this.addObject("Coin", [2050 + 35*n, 1175]);
            }

            this.addObject("Ground", [2150, 1350, 850, 250]);
            this.addSpikeLine(2350, 1325, 2);
            this.addObject("Brick", [2250, 1200]);
            this.addEntity("Mushroom", [2255, 1170]);
            for (let n=0;n<2;n++) {
                this.addObject("Brick", [2500 + 80*n, 1200]);
            }
            this.addCoinBrick(2540, 1200);
            for (let n=0;n<2;n++) {
                this.addCoinBrick(2750 + 40*n, 1200);
            }
            for (let n=0;n<2;n++) {
                this.addObject("Coin", [3015 + 105*n, 1200]);
                this.addObject("Coin", [3050 + 35*n, 1175]);
            }

            this.addObject("Ground", [3150, 1350, 2000, 250]);
            this.addObject("Pipe", [3300, 1225, 400]);
            for (let n=0;n<3;n++) {
                this.addObject("Coin", [3400 + 35*n, 1080 - 20*n]);
            }
            for (let n=0;n<5;n++) {
                this.addObject("Brick", [3500 + 40*n, 1125]);
            }
            for (let n=0;n<2;n++) {
                this.addObject("Brick", [3900 + 40*n, 1200]);
            }
            this.addCoinBrick(3980, 1200);
            this.addObject("Plateform", [4020, 1200, 120]);
            for (let n=0;n<3;n++) {
                this.addObject("Coin", [4027 + 40*n, 1170]);
            }
            this.addCoinBrick(4140, 1200);
            for (let n=0;n<2;n++) {
                this.addObject("Brick", [4180 + 40*n, 1200]);
            }
            for (let n=0;n<3;n++) {
                this.addObject("Brick", [4020 + 40*n, 1075]);
            }
            this.addEntity("Goumba", [3400, 1260]);
            this.addEntity("Goumba", [4360, 1260]);
            this.addObject("Pipe", [4400, 1225, 400]);
            this.addSpikeLine(4550, 1325, 2);
            for (let n=0;n<3;n++) {
                this.addCoinBrick(4700 + 140*n, 1200);
            }
            for (let n=0;n<2;n++) {
                this.addObject("Coin", [5165 + 105*n, 1200]);
                this.addObject("Coin", [5200 + 35*n, 1175]);
            }

            this.addObject("Ground", [5300, 1350, 1400, 250]);
            this.addSpikeLine(5400, 1325, 2);
            this.addEntity("Goumba", [5500, 1260]);
            this.addObject("Brick", [5550, 1200]);
            this.addEntity("Mushroom", [5555, 1170]);
            this.addObject("Ground", [5800, 1300, 150, 105]);
            this.addObject("Ground", [5950, 1225, 150, 155]);
            this.addObject("Plateform", [6100, 1225, 150]);
            this.addObject("Ground", [6250, 1225, 300, 155]);
            this.addCoinBrick(6400, 1075);
            this.addObject("Ground", [6550, 1300, 150, 105]);
            for (let n=0;n<2;n++) {
                this.addObject("Coin", [6715 + 105*n, 1150]);
                this.addObject("Coin", [6750 + 35*n, 1125]);
            }

            this.addObject("Ground", [6850, 1350, 1000, 250]);
            this.addSpikeLine(6950, 1325, 2);
            this.addObject("Pipe", [7150, 1225, 400]);
            for (let n=0;n<4;n++) {
                this.addObject("Brick", [7350 + 40*n, 1125]);
            }
            this.addCoinBrick(7470, 1125);
            this.addEntity("Goumba", [7500, 1260]);
            this.addSpikeLine(7650, 1325, 2);
            for (let n=0;n<2;n++) {
                this.addObject("Coin", [7865 + 105*n, 1200]);
                this.addObject("Coin", [7900 + 35*n, 1175]);
            }

            this.addObject("Ground", [8000, 1350, 2000, 250]);
            this.addSpikeLine(8100, 1325, 2);
            for (let n=0;n<2;n++) {
                this.addObject("Brick", [8200 + 40*n, 1200]);
            }
            this.addCoinBrick(8280, 1200);
            this.addEntity("Goumba", [8500, 1260]);
            
            this.addFlag(8800, 900);
        }

        init = function () {
            this.System.character.x = 100;
            this.System.character.y = 1150;
            this.System.camera.init(1000, this.System.ctx);
        }
    }

    class Level_3 extends Map$1 {
        name = "Jump";
        background_color = "#44362c";
        width = 2600;
        height = 1500;

        constructor (System) {
            super(System);

            this.addObject("Ground", [0, 1300, 500, 200]);
            this.addObject("Bumper", [400, 1280]);
            this.addObject("Bumper", [600, 1280]);
            this.addObject("Ground", [600, 1300, 100, 200]);
            this.addObject("Bumper", [800, 1280]);
            this.addObject("Ground", [800, 1300, 100, 200]);
            this.addObject("Bumper", [1000, 1280]);
            this.addObject("Ground", [1000, 1300, 100, 200]);
            this.addObject("Plateform", [1200, 1280, 100]);
            this.addObject("Bumper", [1450, 1280]);
            this.addObject("Ground", [1450, 1300, 100, 200]);

            this.addObject("Bumper", [1700, 1280]);
            this.addObject("Ground", [1700, 1300, 100, 200]);
            this.addObject("Plateform", [1700, 950, 100]);
            this.addObject("Bumper", [1500, 850]);
            this.addObject("Bumper", [1300, 750]);
            this.addObject("Bumper", [1100, 650]);
            this.addObject("Plateform", [600, 550, 400]);
            this.addObject("Bumper", [500, 575]);
            this.addObject("Ground", [500, 595, 100, 205]);

            this.addObject("Ground", [0, 750, 450, 50]);
            this.addObject("Ground", [0, 700, 250, 75]);
            this.addSpikeLine(450, 475, 2);
            this.addSpikeLine(250, 725, 8);
            this.addObject("Bumper", [100, 680]);
            this.addObject("Ground", [450, 500, 50, 300]);

            this.addObject("Ground", [250, 285, 150, 90]);
            this.addObject("Ground", [400, 200, 100, 175]);
            this.addObject("Plateform", [0, 350, 250]);
            this.addObject("Thunder", [430, 100]);

            this.addObject("Ground", [500, 290, 1000, 85]);
            for (let i=0;i<10;i++) {
                this.addObject("Bumper", [500 + i*100, 200]);
            }
            this.addSpikeLine(500, 0, 40, "down");
            this.addSpikeLine(500, 265, 40);
            this.addObject("Ground", [1500, 200, 200, 175]);

            this.addObject("Plateform", [1700, 200, 80]);
            this.addObject("Plateform", [1980, 200, 20]);
            this.addObject("Plateform", [1750, 300, 220]);
            this.addSpikeLine(1700, 325, 12);
            this.addObject("Plateform", [1700, 350, 300]);
            this.addObject("Ground", [1800, 0, 150, 230]);

            this.addObject("Ground", [2000, 200, 100, 1300]);
            this.addObject("Plateform", [2100, 200, 100]);
            this.addObject("Ground", [2200, 0, 100, 1110]);
            this.addObject("Ground", [2100, 1300, 500, 200]);
            this.addObject("Plateform", [2100, 1100, 100]);
            this.addFlag(2500, 850);
        };

        init = function () {
            this.System.character.x = 100;
            this.System.character.y = 1150;
            this.System.camera.init(1000, this.System.ctx);
        };
    }

    var mapsList = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Level_1: Level_1,
        Level_2: Level_2,
        Level_3: Level_3
    });

    /* src/App.svelte generated by Svelte v3.59.2 */

    const { Object: Object_1 } = globals;
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let div1;
    	let div0;
    	let canvas;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			canvas = element("canvas");
    			add_location(canvas, file, 182, 2, 4325);
    			attr_dev(div0, "id", "body");
    			add_location(div0, file, 181, 1, 4307);
    			attr_dev(div1, "id", "html");
    			attr_dev(div1, "class", "svelte-roegvq");
    			add_location(div1, file, 180, 0, 4290);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, canvas);
    			/*canvas_binding*/ ctx[1](canvas);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			/*canvas_binding*/ ctx[1](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	const System = {
    		objects: {
    			class: [],
    			instance: [],
    			get(name) {
    				for (let i = 0; i < this.instance.length; i++) {
    					if (this.instance[i].name == name) {
    						return this.class[i];
    					}
    				}
    			}
    		},
    		entities: {
    			class: [],
    			instance: [],
    			get(name) {
    				for (let i = 0; i < this.instance.length; i++) {
    					if (this.instance[i].name == name) {
    						return this.class[i];
    					}
    				}
    			}
    		},
    		maps: {
    			class: [],
    			instance: [],
    			get(name) {
    				for (let i = 0; i < this.instance.length; i++) {
    					if (this.instance[i].name == name) {
    						return new this.class[i](System);
    					}
    				}
    			},
    			define(name) {
    				$$invalidate(0, System.map = this.get(name), System);
    			}
    		},
    		animation: {},
    		camera: {},
    		character: {},
    		map: {},
    		gravity: 0.4,
    		checkCollision(object1, object2) {
    			if (object1.x + object1.width > object2.x && object1.x < object2.x + object2.width && object1.y + object1.height > object2.y && object1.y < object2.y + object2.height) {
    				return true;
    			}
    		},
    		newGame(name) {
    			this.character = new Character();
    			this.camera = new Camera();
    			this.maps.define(name);
    			this.map.init();
    			goGame(System);
    		},
    		retry() {
    			this.newGame(this.map.name);
    		},
    		empty(color) {
    			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    			this.ctx.fillStyle = color;
    			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    		}
    	};

    	for (const object of Object.keys(objectsList)) {
    		const objectClass = objectsList[object];
    		const objectInstance = new objectClass(System, []);
    		System.objects.class.push(objectClass);
    		System.objects.instance.push(objectInstance);
    	}

    	for (const entity of Object.keys(entitiesList)) {
    		const entityClass = entitiesList[entity];
    		const entityInstance = new entityClass(System, []);
    		System.entities.class.push(entityClass);
    		System.entities.instance.push(entityInstance);
    	}

    	for (const map of Object.keys(mapsList)) {
    		const mapClass = mapsList[map];
    		const mapInstance = new mapClass(System);
    		System.maps.class.push(mapClass);
    		System.maps.instance.push(mapInstance);
    	}
    	let fpsInterval, startTime, now, then, elapsed;

    	onMount(() => {
    		$$invalidate(0, System.ctx = System.canvas.getContext('2d'), System);
    		$$invalidate(0, System.canvas.width = document.body.clientWidth, System);
    		$$invalidate(0, System.canvas.height = document.body.clientHeight, System);
    		document.addEventListener("keyup", keyUpHandler, false);
    		document.addEventListener("keydown", keyDownHandler, false);
    		goMenu(System);
    		startAnimating(60);
    	});

    	function startAnimating(fps) {
    		fpsInterval = 1000 / fps;
    		then = Date.now();
    		startTime = then;
    		animate();
    	}

    	function animate() {
    		requestAnimationFrame(animate);
    		now = Date.now();
    		elapsed = now - then;

    		if (elapsed > fpsInterval) {
    			then = now - elapsed % fpsInterval;

    			switch (System.page.name) {
    				case "menu":
    					menu(System);
    					break;
    				case "game":
    					game(System);
    					break;
    				case "win":
    					win(System);
    					break;
    				case "loose":
    					loose(System);
    					break;
    			}
    		}
    	}

    	function keyUpHandler(e) {
    		switch (System.page.name) {
    			case "menu":
    				keyUpMenu(System, e);
    				break;
    			case "game":
    				keyUpGame(System, e);
    				break;
    			case "win":
    				keyUpWin(System, e);
    				break;
    			case "loose":
    				keyUpLoose(System, e);
    				break;
    		}
    	}

    	function keyDownHandler(e) {
    		switch (System.page.name) {
    			case "menu":
    				keyDownMenu(System, e);
    				break;
    			case "game":
    				keyDownGame(System, e);
    				break;
    			case "win":
    				keyDownWin(System, e);
    				break;
    			case "loose":
    				keyDownLoose(System, e);
    				break;
    		}
    	}
    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function canvas_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			System.canvas = $$value;
    			$$invalidate(0, System);
    		});
    	}

    	$$self.$capture_state = () => ({
    		Camera,
    		Character,
    		goMenu,
    		keyUpMenu,
    		keyDownMenu,
    		menu,
    		goGame,
    		keyUpGame,
    		keyDownGame,
    		game,
    		keyUpWin,
    		keyDownWin,
    		win,
    		keyUpLoose,
    		keyDownLoose,
    		loose,
    		System,
    		objectsList,
    		entitiesList,
    		mapsList,
    		onMount,
    		fpsInterval,
    		startTime,
    		now,
    		then,
    		elapsed,
    		startAnimating,
    		animate,
    		keyUpHandler,
    		keyDownHandler
    	});

    	$$self.$inject_state = $$props => {
    		if ('fpsInterval' in $$props) fpsInterval = $$props.fpsInterval;
    		if ('startTime' in $$props) startTime = $$props.startTime;
    		if ('now' in $$props) now = $$props.now;
    		if ('then' in $$props) then = $$props.then;
    		if ('elapsed' in $$props) elapsed = $$props.elapsed;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [System, canvas_binding];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    var app = new App({
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
