
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
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
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
    function set_style(node, key, value, important) {
        if (value == null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
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
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
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
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    function create_component(block) {
        block && block.c();
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
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    function construct_svelte_component_dev(component, props) {
        const error_message = 'this={...} of <svelte:component> should specify a Svelte component.';
        try {
            const instance = new component(props);
            if (!instance.$$ || !instance.$set || !instance.$on || !instance.$destroy) {
                throw new Error(error_message);
            }
            return instance;
        }
        catch (err) {
            const { message } = err;
            if (typeof message === 'string' && message.indexOf('is not a constructor') !== -1) {
                throw new Error(error_message);
            }
            else {
                throw err;
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

    class Skill {
        name;
        level;
        description;
        xp = 0;

        constructor(level = 0) {
            this.level = level;
        }

        addXp = function (value) {
            if (this.level > 0 && this.level < 10) {
                this.xp += value;
                if (this.xp > 100) {
                    this.xp -= 100;
                    this.level++;
                }
            }
        }
    }

    class Pilotage extends Skill {
        name = "Pilotage";
        description = "Augmente les chances d'esquiver une attaque ou un choc.";

        constructor (level) {
            super(level);
        }
    }

    class Commerce extends Skill {
        name = "Commerce";
        description = "Diminue les prix chez les marchands.";

        constructor (level) {
            super(level);
        }
    }

    class Combat extends Skill {
        name = "Combat";
        description = "Augmente les dégâts réalisés lors d'un combat.";

        constructor (level) {
            super(level);
        }
    }

    var skills = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Combat: Combat,
        Commerce: Commerce,
        Pilotage: Pilotage
    });

    let Character$2 = class Character {
        name;
        race;
        sexe;
        life;
        life_max = function () {
            let value = 10;
            return value;
        };
        skills = [];

        constructor(System) {
            this.life = this.life_max();
            for (const skill of System.skills.class) {
                this.skills.push(new skill());
            }
        }

        listSkill = function () {
            let list = [];
            for (const skill of this.skills) {
                if (skill.level > 0) {
                    list.push(skill);
                }
            }
            return list;
        };

        getSkill = function (name) {
            for (const skill of this.skills) {
                if (skill.name == name) {
                    return skill;
                }
            }
        };
    };

    class Humain extends Character$2 {
        race = "Humain";

        constructor (System) {
            super(System);
            this.sexe = "Homme";
            let listName = ["Alexandre", "Antoine", "Aurélien", "Bastien", "Clément", "Daniel", "David", "Guillaume", "Gabriel", "Hector", "Jean", "Justin", "Laurent", "Lucien", "Ludovic", "Marc", "Martin", "Nicolas", "Oscar", "Paul", "Phillipe", "Simon", "Xavier"];
            if (Math.random() < 0.5) {
                this.sexe = "Femme";
                listName = ["Adèle", "Agathe", "Anne", "Béatrice", "Betty", "Caroline", "Claire", "Clara", "Clémence", "Clémentine", "Diane", "Gaëlle", "Heloise", "Jane", "Jeanne", "Julie", "Justine", "Laure", "Laurence", "Léa", "Lucie", "Manon", "Marie", "Marina", "Marine", "Nadine", "Noémie", "Ondine", "Orélie", "Paula", "Philippine", "Sarah", "Simone", "Zara"];
            }
            this.name = listName[Math.floor(Math.random()*listName.length)];
        }
    }

    var races = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Humain: Humain
    });

    let Part$1 = class Part {
        name;
        level;
        levels = [];
        description;
        weapon = false;

        constructor (level = 1) {
            this.level = level;
        }

        add = function (System, ship) {};

        upgrade = function (System) {
            this.level++;
            this.upgradeEffect(System);
        };

        upgradeEffect = function (System) {};
    };

    class Moteurs extends Part$1 {
        name = "Moteurs";
        description = "Les moteurs du vaisseau, permettant la propulsion une fois dans l'orbite de planète.";
        levels = [{
            level : 1,
            text : "10 Carburant dépensés par action",
            price : 50,
        },{
            level : 2,
            text : "9 Carburant dépensés par action",
            price : 25,
        },{
            level : 3,
            text : "8 Carburant dépensés par action",
            price : 50,
        },{
            level : 4,
            text : "7 Carburant dépensés par action",
            price : 75,
        },{
            level : 5,
            text : "6 Carburant dépensés par action",
            price : 100,
        },{
            level : 6,
            text : "5 Carburant dépensés par action",
            price : 150,
        }];

        constructor (level=1) {
            super(level);
        }

        move = function () {
            switch (this.level) {
                case 1:
                    return 10;
                case 2:
                    return 8;
                case 3:
                    return 6;
            }
        }
    }

    class CannonLeger extends Part$1 {
        name = "Cannon léger";
        description = "Un cannon simple et fiable pour les batailles spatiales.";
        weapon = true;
        levels = [{
            level : 1,
            text : "3 dégâts par tir",
            price : 50,
        },{
            level : 2,
            text : "6 dégâts par tir",
            price : 25,
        },{
            level : 3,
            text : "9 dégâts par tir",
            price : 50,
        },{
            level : 4,
            text : "12 dégâts par tir",
            price : 75,
        },{
            level : 5,
            text : "15 dégâts par tir",
            price : 100,
        },{
            level : 6,
            text : "18 dégâts par tir",
            price : 150,
        },{
            level : 7,
            text : "21 dégâts par tir",
            price : 200,
        },{
            level : 8,
            text : "24 dégâts par tir",
            price : 300,
        },{
            level : 9,
            text : "27 dégâts par tir",
            price : 400,
        },{
            level : 10,
            text : "30 dégâts par tir",
            price : 500,
        }];

        constructor (level) {
            super(level);
        }

        attack = attack$3(this);
    }

    function attack$3 (part) {
        let attack = {
            nom : "Attaquer",
            part : part,
            description : function () {
                return "Inflige " + 3*this.part.level + " dégâts.";
            },
            cost : function () {
                return "- 3 Énergie";
            },
            need : function (ship) {
                if (ship.energy >= 3) {
                    return true;
                }
                return false;
            },
            use : function (ship, target) {
                ship.energy -= 3;
                if (Math.random() + target.avoid() < 1 + ship.accuracy()) {
                    let damage_result = target.damage(ship.damageBoost(3*this.part.level));
                    return target.name + " subit " + damage_result.total + " dégâts.";
                }
                else {
                    return target.name + " esquive l'attaque.";
                }
            }
        };
        return attack;
    }

    class CannonLourd extends Part$1 {
        name = "Cannon lourd";
        description = "Un cannon puissant pour les batailles spatiales.";
        weapon = true;
        levels = [{
            level : 1,
            text : "5 dégâts par tir",
            price : 50,
        },{
            level : 2,
            text : "10 dégâts par tir",
            price : 25,
        },{
            level : 3,
            text : "15 dégâts par tir",
            price : 50,
        },{
            level : 4,
            text : "20 dégâts par tir",
            price : 75,
        },{
            level : 5,
            text : "25 dégâts par tir",
            price : 100,
        },{
            level : 6,
            text : "30 dégâts par tir",
            price : 150,
        },{
            level : 7,
            text : "35 dégâts par tir",
            price : 200,
        },{
            level : 8,
            text : "40 dégâts par tir",
            price : 300,
        },{
            level : 9,
            text : "45 dégâts par tir",
            price : 400,
        },{
            level : 10,
            text : "50 dégâts par tir",
            price : 500,
        }];

        constructor (level) {
            super(level);
        }

        attack = attack$2(this);
    }

    function attack$2 (part) {
        let attack = {
            nom : "Attaquer",
            part : part,
            description : function () {
                return "Inflige " + 5*this.part.level + " dégâts. 85% de précision.";
            },
            cost : function () {
                return "- 4 Énergie";
            },
            need : function (ship) {
                if (ship.energy >= 4) {
                    return true;
                }
                return false;
            },
            use : function (ship, target) {
                ship.energy -= 4;
                if (Math.random() + target.avoid() < 0.85 + ship.accuracy()) {
                    let damage_result = target.damage(ship.damageBoost(5*this.part.level));
                    return target.name + " subit " + damage_result.total + " dégâts.";
                }
                else {
                    return target.name + " esquive l'attaque.";
                }
            }
        };
        return attack;
    }

    class Scanner extends Part$1 {
        name = "Scanner";
        description = "Des outils de spectrométrie indiquant la nature de planètes avoisinantes.";
        levels = [{
            level : 1,
            text : "Affiche la nature des planètes de l'étape suivante",
            price : 50,
        },{
            level : 2,
            text : "Affiche la nature des planètes des 2 étapes suivantes",
            price : 25,
        },{
            level : 3,
            text : "Affiche la nature des planètes des 3 étapes suivantes",
            price : 50,
        },{
            level : 4,
            text : "Affiche la nature des planètes des 4 étapes suivantes",
            price : 75,
        },{
            level : 5,
            text : "Affiche la nature des planètes des 5 étapes suivantes",
            price : 100,
        }];

        constructor(level) {
            super(level);
        }

        scan = function (System) {
            for (let i = 1; i <= this.level; i++) {
                if (System.game.planet.step + i < System.game.sector.steps.length) {
                    let step = System.game.sector.steps[System.game.planet.step + i];
                    for (let j = 0; j < step.length; j++) {
                        step[j].info = true;
                    }
                }
            }
        }

        upgradeEffect = function (System) {
            this.scan(System);
        }
    }

    class Coque extends Part$1 {
        name = "Coque";
        description = "La structure du vaisseau.";
        levels = [{
            level : 1,
            text : "10 points de vie max",
            price : 50,
        },{
            level : 2,
            text : "20 points de vie max",
            price : 25,
        },{
            level : 3,
            text : "30 points de vie max",
            price : 50,
        },{
            level : 4,
            text : "40 points de vie max",
            price : 75,
        },{
            level : 5,
            text : "50 points de vie max",
            price : 100,
        },{
            level : 6,
            text : "60 points de vie max",
            price : 150,
        },{
            level : 7,
            text : "70 points de vie max",
            price : 200,
        },{
            level : 8,
            text : "80 points de vie max",
            price : 300,
        },{
            level : 9,
            text : "90 points de vie max",
            price : 400,
        },{
            level : 10,
            text : "100 points de vie max",
            price : 500,
        },{
            level : 11,
            text : "110 points de vie max",
            price : 600,
        },{
            level : 12,
            text : "120 points de vie max",
            price : 750,
        }];

        constructor (level) {
            super(level);
        }

        add = function (System, ship) {
            ship.life = ship.life_max();
        }

        upgradeEffect = function (System) {
            System.game.ship.life += 10;
        }
    }

    class Blindage extends Part$1 {
        name = "Blindage";
        description = "Diminue les dégâts reçus par le vaisseau.";
        levels = [{
            level : 1,
            text : "Réduction de 1 dégât",
            price : 50,
        },{
            level : 2,
            text : "Réduction de 2 dégâts",
            price : 25,
        },{
            level : 3,
            text : "Réduction de 3 dégâts",
            price : 50,
        },{
            level : 4,
            text : "Réduction de 4 dégâts",
            price : 75,
        },{
            level : 5,
            text : "Réduction de 5 dégâts",
            price : 100,
        }];

        constructor (level) {
            super(level);
        }
    }

    class Bouclier extends Part$1 {
        name = "Bouclier";
        description = "Absorbe des dégâts pour prôtéger le vaisseau. Se reforme à chaque saut.";
        levels = [{
            level : 1,
            text : "5 point de bouclier",
            price : 50,
        },{
            level : 2,
            text : "10 point de bouclier",
            price : 25,
        },{
            level : 3,
            text : "15 point de bouclier",
            price : 50,
        },{
            level : 4,
            text : "20 point de bouclier",
            price : 75,
        },{
            level : 5,
            text : "25 point de bouclier",
            price : 100,
        }];

        constructor (level) {
            super(level);
        }

        add = function (System, ship) {
            ship.shield = ship.shield_max();
        }

        upgradeEffect = function (System) {
            System.game.ship.shield += 5;
        }
    }

    class Maintenance extends Part$1 {
        name = "Maintenance";
        description = "Répare le vaisseau à chaque saut.";
        levels = [{
            level : 1,
            text : "Soigne 2 point de vie à chaque saut",
            price : 50,
        },{
            level : 2,
            text : "Soigne 4 point de vie à chaque saut",
            price : 25,
        },{
            level : 3,
            text : "Soigne 6 point de vie à chaque saut",
            price : 50,
        },{
            level : 4,
            text : "Soigne 8 point de vie à chaque saut",
            price : 75,
        },{
            level : 5,
            text : "Soigne 10 point de vie à chaque saut",
            price : 100,
        }];

        constructor (level) {
            super(level);
        }

        heal = function (System) {
            System.game.ship.heal(2*this.level);
        }
    }

    class Catalyseur extends Part$1 {
        name = "Catalyseur";
        description = "Génère du carburant à chaque saut.";
        levels = [{
            level : 1,
            text : "+1 Carburant à chaque saut",
            price : 50,
        },{
            level : 2,
            text : "+2 Carburant à chaque saut",
            price : 25,
        },{
            level : 3,
            text : "+3 Carburant à chaque saut",
            price : 50,
        },{
            level : 4,
            text : "+4 Carburant à chaque saut",
            price : 75,
        },{
            level : 5,
            text : "+5 Carburant à chaque saut",
            price : 100,
        }];

        constructor (level) {
            super(level);
        }

        giveFuel = function (System) {
            System.game.ship.fuel += this.level;
        }
    }

    class Generateur extends Part$1 {
        name = "Générateur";
        description = "Distribue l'énergie aux armes lors de combat.";
        levels = [{
            level : 1,
            text : "1 énergie max",
            price : 50,
        },{
            level : 2,
            text : "2 énergie max",
            price : 25,
        },{
            level : 3,
            text : "3 énergie max",
            price : 50,
        },{
            level : 4,
            text : "4 énergie max",
            price : 75,
        },{
            level : 5,
            text : "5 énergie max",
            price : 100,
        },{
            level : 6,
            text : "6 énergie max",
            price : 150,
        },{
            level : 7,
            text : "7 énergie max",
            price : 200,
        },{
            level : 8,
            text : "8 énergie max",
            price : 300,
        },{
            level : 9,
            text : "9 énergie max",
            price : 400,
        },{
            level : 10,
            text : "10 énergie max",
            price : 500,
        },{
            level : 11,
            text : "11 énergie max",
            price : 600,
        },{
            level : 12,
            text : "12 énergie max",
            price : 750,
        }];

        constructor (level) {
            super(level);
        }
    }

    class Dortoirs extends Part$1 {
        name = "Dortoirs";
        description = "Loge les membres d'équipages.";
        levels = [{
            level : 1,
            text : "1 membres d'équipage max",
            price : 50,
        },{
            level : 2,
            text : "2 membres d'équipage max",
            price : 25,
        },{
            level : 3,
            text : "3 membres d'équipage max",
            price : 50,
        },{
            level : 4,
            text : "4 membres d'équipage max",
            price : 75,
        },{
            level : 5,
            text : "5 membres d'équipage max",
            price : 100,
        }];

        constructor (level) {
            super(level);
        }
    }

    class DroneDeCombat extends Part$1 {
        name = "Drone de combat";
        description = "Un drone d'attaque tirant automatiquement sur les vaisseaux ennemis.";
        levels = [{
            level : 1,
            text : "Inflige 2 dégâts à chaque tour de combat",
            price : 50,
        },{
            level : 2,
            text : "Inflige 4 dégâts à chaque tour de combat",
            price : 25,
        },{
            level : 3,
            text : "Inflige 6 dégâts à chaque tour de combat",
            price : 50,
        },{
            level : 4,
            text : "Inflige 8 dégâts à chaque tour de combat",
            price : 75,
        },{
            level : 5,
            text : "Inflige 10 dégâts à chaque tour de combat",
            price : 100,
        }];

        constructor (level) {
            super(level);
        }

        action = function (ship, target) {
            if (Math.random() + target.avoid() < 1 + ship.accuracy()) {
                let damage_result = target.damage(2*this.level);
                return target.name + " subit " + damage_result.total + " dégâts.";
            }
            else {
                return target.name + " esquive l'attaque.";
            }
        };
    }

    class DroneDeReparation extends Part$1 {
        name = "Drone de réparation";
        description = "Un drone de support réparant les dégâts subis par le vaisseau au fur et à mesure des combats.";
        levels = [{
            level : 1,
            text : "Soigne 2 point de vie à chaque tour de combat",
            price : 50,
        },{
            level : 2,
            text : "Soigne 4 points de vie à chaque tour de combat",
            price : 25,
        },{
            level : 3,
            text : "Soigne 6 points de vie à chaque tour de combat",
            price : 50,
        },{
            level : 4,
            text : "Soigne 8 points de vie à chaque tour de combat",
            price : 75,
        },{
            level : 5,
            text : "Soigne 10 points de vie à chaque tour de combat",
            price : 100,
        }];

        constructor (level) {
            super(level);
        }

        action = function (ship) {
            ship.heal(2*this.level);
            return ship.name + " se soigne de " + 2*this.level + " points de vie.";
        };
    }

    class Extracteur extends Part$1 {
        name = "Extracteur";
        description = "Exraie de l'acier dans les débris spatiaux que votre vaisseau recontre sur le chemin entre 2 planètes.";
        levels = [{
            level : 1,
            text : "+2 Acier à chaque saut",
            price : 50,
        },{
            level : 2,
            text : "+4 Acier à chaque saut",
            price : 25,
        },{
            level : 3,
            text : "+6 Acier à chaque saut",
            price : 50,
        },{
            level : 4,
            text : "+8 Acier à chaque saut",
            price : 75,
        },{
            level : 5,
            text : "+10 Acier à chaque saut",
            price : 100,
        }];

        constructor (level) {
            super(level);
        }

        giveSteel = function (System) {
            System.game.steel += 2*this.level;
        }
    }

    class Laser extends Part$1 {
        name = "Laser";
        description = "Un rayon laser perforant le blindage ennemi.";
        weapon = true;
        levels = [{
            level : 1,
            text : "2 dégâts par tir",
            price : 50,
        },{
            level : 2,
            text : "4 dégâts par tir",
            price : 25,
        },{
            level : 3,
            text : "6 dégâts par tir",
            price : 50,
        },{
            level : 4,
            text : "8 dégâts par tir",
            price : 75,
        },{
            level : 5,
            text : "10 dégâts par tir",
            price : 100,
        },{
            level : 6,
            text : "12 dégâts par tir",
            price : 150,
        },{
            level : 7,
            text : "14 dégâts par tir",
            price : 200,
        },{
            level : 8,
            text : "16 dégâts par tir",
            price : 300,
        },{
            level : 9,
            text : "18 dégâts par tir",
            price : 400,
        },{
            level : 10,
            text : "20 dégâts par tir",
            price : 500,
        }];

        constructor (level) {
            super(level);
        }

        attack = attack$1(this);
    }

    function attack$1 (part) {
        let attack = {
            nom : "Attaquer",
            part : part,
            description : function () {
                return "Inflige " + 2*this.part.level + " dégâts. Ignore la réduction de dégâts du vaisseau adverse.";
            },
            cost : function () {
                return "- 3 Énergie";
            },
            need : function (ship) {
                if (ship.energy >= 3) {
                    return true;
                }
                return false;
            },
            use : function (ship, target) {
                ship.energy -= 3;
                if (Math.random() + target.avoid() < 1 + ship.accuracy()) {
                    let damage_result = target.damage(ship.damageBoost(2*this.part.level, true));
                    return target.name + " subit " + damage_result.total + " dégâts.";
                }
                else {
                    return target.name + " esquive l'attaque.";
                }
            }
        };
        return attack;
    }

    class AideALaVisee extends Part$1 {
        name = "Aide à la visée";
        description = "Augmente la précision des armes lors d'un combat.";
        levels = [{
            level : 1,
            text : "5% de précision",
            price : 50,
        },{
            level : 2,
            text : "10% de précision",
            price : 25,
        },{
            level : 3,
            text : "15% de précision",
            price : 50,
        },{
            level : 4,
            text : "20% de précision",
            price : 75,
        },{
            level : 5,
            text : "25% de précision",
            price : 100,
        }];

        constructor (level) {
            super(level);
        }
    }

    class TirsPerforants extends Part$1 {
        name = "Tirs perforants";
        description = "Augmente tous les dégâts infligés par vos armes.";
        levels = [{
            level : 1,
            text : "Augmentation de 1 dégât",
            price : 50,
        },{
            level : 2,
            text : "Augmentation de 2 dégâts",
            price : 25,
        },{
            level : 3,
            text : "Augmentation de 3 dégâts",
            price : 50,
        },{
            level : 4,
            text : "Augmentation de 4 dégâts",
            price : 75,
        },{
            level : 5,
            text : "Augmentation de 5 dégâts",
            price : 100,
        }];

        constructor (level) {
            super(level);
        }
    }

    class TirsExplosifs extends Part$1 {
        name = "Tirs explosifs";
        description = "Augmente tous les dégâts infligés par vos armes.";
        levels = [{
            level : 1,
            text : "Augmentation des dégâts de 10%",
            price : 50,
        },{
            level : 2,
            text : "Augmentation des dégâts de 20%",
            price : 25,
        },{
            level : 3,
            text : "Augmentation des dégâts de 30%",
            price : 50,
        },{
            level : 4,
            text : "Augmentation des dégâts de 40%",
            price : 75,
        },{
            level : 5,
            text : "Augmentation des dégâts de 50%",
            price : 100,
        }];

        constructor (level) {
            super(level);
        }
    }

    class CannonMitrailleur extends Part$1 {
        name = "Cannon mitrailleur";
        description = "Un cannon tirant à de multiples reprises.";
        weapon = true;
        levels = [{
            level: 1,
            text: "1 dégâts par tir",
            price: 50,
        }, {
            level: 2,
            text: "2 dégâts par tir",
            price: 25,
        }, {
            level: 3,
            text: "3 dégâts par tir",
            price: 50,
        }, {
            level: 4,
            text: "4 dégâts par tir",
            price: 75,
        }, {
            level: 5,
            text: "5 dégâts par tir",
            price: 100,
        }, {
            level: 6,
            text: "6 dégâts par tir",
            price: 150,
        }, {
            level: 7,
            text: "7 dégâts par tir",
            price: 200,
        }, {
            level: 8,
            text: "8 dégâts par tir",
            price: 300,
        }, {
            level: 9,
            text: "9 dégâts par tir",
            price: 400,
        }, {
            level: 10,
            text: "10 dégâts par tir",
            price: 500,
        }];

        constructor(level) {
            super(level);
        }

        attack = attack(this);
    }

    function attack(part) {
        let attack = {
            nom: "Attaquer",
            part: part,
            description: function () {
                return "Inflige 3 fois " + this.part.level + " dégâts.";
            },
            cost: function () {
                return "- 3 Énergie";
            },
            need: function (ship) {
                if (ship.energy >= 3) {
                    return true;
                }
                return false;
            },
            use: function (ship, target) {
                ship.energy -= 3;
                let action_result = "";
                for (let i = 0; i < 3; i++) {
                    if (Math.random() + target.avoid() < 1 + ship.accuracy()) {
                        let damage_result = target.damage(ship.damageBoost(this.part.level));
                        action_result += target.name + " subit " + damage_result.total + " dégâts. \n";
                    }
                    else {
                        action_result += target.name + " esquive l'attaque. \n";
                    }
                }
                return action_result;
            }
        };
        return attack;
    }

    var parts = /*#__PURE__*/Object.freeze({
        __proto__: null,
        AideALaVisee: AideALaVisee,
        Blindage: Blindage,
        Bouclier: Bouclier,
        CannonLeger: CannonLeger,
        CannonLourd: CannonLourd,
        CannonMitrailleur: CannonMitrailleur,
        Catalyseur: Catalyseur,
        Coque: Coque,
        Dortoirs: Dortoirs,
        DroneDeCombat: DroneDeCombat,
        DroneDeReparation: DroneDeReparation,
        Extracteur: Extracteur,
        Generateur: Generateur,
        Laser: Laser,
        Maintenance: Maintenance,
        Moteurs: Moteurs,
        Scanner: Scanner,
        TirsExplosifs: TirsExplosifs,
        TirsPerforants: TirsPerforants
    });

    let Ship$2 = class Ship {
        name;
        life = 0;
        life_max = function () {
            let value = 0;
            if (this.checkPart("Coque")) {
                value += 10*this.getPart("Coque").level;
            }
            return value;
        };
        shield = 0;
        shield_max = function () {
            let value = 0;
            if (this.checkPart("Bouclier")) {
                value += 5*this.getPart("Bouclier").level;
            }
            return value;
        };
        damageAdd = function () {
            let value = 0;
            if (this.checkPart("Tirs perforants")) {
                value += this.getPart("Tirs perforants").level;
            }
            return value;
        };
        damageProd = function () {
            let value = 1;
            if (this.checkPart("Tirs explosifs")) {
                value += 0.1*this.getPart("Tirs explosifs").level;
            }
            return value;
        };
        damageBoost = function (value) {
            value += this.damageAdd();
            value = parseInt(value*this.damageProd());
            return value;
        };
        defense = function () {
            let value = 0;
            if (this.checkPart("Blindage")) {
                value += this.getPart("Blindage").level;
            }
            return value;
        };
        accuracy = function () {
            let value = 0;
            if (this.checkPart("Aide à la visée")) {
                value += 5*this.getPart("Aide à la visée").level;
            }
            return value;
        };
        dodge = false;
        avoid = function () {
            let value = 0;
            value += this.totalSkill("Pilotage")*0.05;
            if (this.dodge) {
                value += 0.15;
            }
            return value;
        };
        energy = 0;
        energy_max = function () {
            let value = 0;
            if (this.checkPart("Générateur")) {
                value += this.getPart("Générateur").level;
            }
            return value;
        };
        characters = [];
        characters_max = function () {
            let value = 0;
            if (this.checkPart("Dortoirs")) {
                value += this.getPart("Dortoirs").level;
            }
            return value;
        };
        fuel = 100;
        parts = [];

        constructor(game, name) {
            this.game = game;
            this.name = name;
        };

        checkPart = function (name, level = 1) {
            for (const part of this.parts) {
                if (part.name == name) {
                    if (part.level >= level) {
                        return true;
                    }
                    return false;
                }
            }
            return false;
        };

        getPart = function (name) {
            for (const part of this.parts) {
                if (part.name == name) {
                    return part;
                }
            }
            return false;
        };

        addPart = function (System, part) {
            this.parts.push(part);
            part.add(System, this);
        };

        damage = function (value, perce=false) {
            if (perce=false) {
                value -= this.defense();
            }
            if (value < 0) {
                value = 0;
            }
            let total = value;

            let absorb = 0;
            if (this.shield > 0) {
                if (this.shield >= value) {
                    this.shield -= value;
                    absorb = value;
                    value = 0;
                }
                else {
                    value -= this.shield;
                    absorb = this.shield;
                    this.shield = 0;
                }
            }

            this.life -= value;
            if (this.life < 0) {
                this.life = 0;
            }

            return {total:total,value:value,absorb:absorb};
        };

        heal = function (value) {
            this.life += value;
            if (this.life > this.life_max()) {
                this.life = this.life_max();
            }
        };

        totalSkill = function (name) {
            let value = 0;
            for (const character of this.characters) {
                value += character.getSkill(name).level;
            }
            return value;
        };

        useSkill = function (name, xp) {
            for (const character of this.characters) {
                character.getSkill(name).addXp(xp);
            }
        };
    };

    class Federation {
        name = "Fédération";
        ship = {};

        constructor (System) {
            let ship = new Ship$2(System.game, "Fédération");

            let pilote = System.races.getByName("Humain");
            pilote.getSkill("Pilotage").level = 1;
            ship.characters.push(pilote);
            
            let soldat = System.races.getByName("Humain");
            soldat.getSkill("Combat").level = 1;
            ship.characters.push(soldat);

            let marchand = System.races.getByName("Humain");
            marchand.getSkill("Commerce").level = 1;
            ship.characters.push(marchand);
            
            ship.addPart(System, System.parts.getByName("Coque", 3));
            ship.addPart(System, System.parts.getByName("Dortoirs", 3));
            ship.addPart(System, System.parts.getByName("Générateur", 3));
            ship.addPart(System, System.parts.getByName("Moteurs"));
            ship.addPart(System, System.parts.getByName("Scanner"));
            ship.addPart(System, System.parts.getByName("Cannon léger", 2));
            
            this.ship = ship;
        }
    }

    var starters = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Federation: Federation
    });

    class Planet {
        name;
        step;
        info = false;
        visited = false;
        event;

        constructor (step) {
            this.step = step;
        }
    }

    class PlaneteHumaine extends Planet {
        name = "Planète civile";

        constructor (System, level, step, event="Random") {
            super(step);
            if (event == "Random") {
                let listEvent;
                if (Math.random() < 0.5) {
                    listEvent = ["Vaisseau pirate"];
                }
                else {
                    listEvent = ["Rien", "Fouille"];
                }
                this.event = System.events.getByName(listEvent[parseInt(Math.random()*listEvent.length)], level);
            }
            else {
                this.event = System.events.getByName(event, level);
            }
        }
    }

    class Asteroides extends Planet {
        name = "Astéroides";

        constructor (System, level, step, event="Random") {
            super(step);
            if (event == "Random") {
                let listEvent;
                if (Math.random() < 0.5) {
                    listEvent = ["Vaisseau pirate"];
                }
                else {
                    listEvent = ["Rien", "Collision"];
                }
                this.event = System.events.getByName(listEvent[parseInt(Math.random()*listEvent.length)], level);
            }
            else {
                this.event = System.events.getByName(event, level);
            }
        }
    }

    class StationMarchande extends Planet {
        name = "Station marchande";

        constructor (System, level, step, event="Random") {
            super(step);
            this.event = System.events.getByName("Marchand", level);
        }
    }

    class BaseEnnemie extends Planet {
        name = "Base ennemie";

        constructor (System, level, step, event="Random") {
            super(step);
            this.event = System.events.getByName("Vaisseau mère", level);
        }
    }

    var planets = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Asteroides: Asteroides,
        BaseEnnemie: BaseEnnemie,
        PlaneteHumaine: PlaneteHumaine,
        StationMarchande: StationMarchande
    });

    let Sector$1 = class Sector {
        name;
        slot;
        info = false;
        visited = false;
        steps = [];

        constructor(slot) {
            this.slot = slot;
        }
    };

    class SecteurHumain extends Sector$1 {
        name = "Secteur Humain";

        constructor(System, slot) {
            super(slot);
            for (let i = 0; i < 21; i++) {
                let step = [];
                if (i == 0) {
                    step.push(System.planets.getByName("Planète civile", slot + 1, i));
                }
                else if (i == 20) {
                    step.push(System.planets.getByName("Base ennemie", slot + 1, i));
                }
                else {
                    let listPlanet;
                    if (Math.random() < 0.75) {
                        listPlanet = ["Planète civile"];
                    }
                    else {
                        listPlanet = ["Astéroides"];
                    }
                    for (let j = 0; j < 1 + parseInt(Math.random() * 3); j++) {
                        step.push(System.planets.getByName(listPlanet[parseInt(Math.random()*listPlanet.length)], slot + 1, i));
                    }
                }
                this.steps.push(step);
            }
            let listShop = [];
            for (let i = 0; i < 2; i++) {
                let randomStep = 1 + parseInt(Math.random() * (this.steps.length - 2));
                while (listShop.includes(randomStep)) {
                    randomStep = 1 + parseInt(Math.random() * (this.steps.length - 2));
                }
                listShop.push(randomStep);
                this.steps[randomStep][parseInt(Math.random() * this.steps[randomStep].length)] = System.planets.getByName("Station marchande", slot + 1, randomStep);
            }
        }
    }

    var sectors = /*#__PURE__*/Object.freeze({
        __proto__: null,
        SecteurHumain: SecteurHumain
    });

    /* src/Events/Rien/Interface.svelte generated by Svelte v3.59.2 */

    const file$n = "src/Events/Rien/Interface.svelte";

    function create_fragment$o(ctx) {
    	let t0;
    	let br0;
    	let br1;
    	let t1;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			t0 = text("Le voyage se déroule sans encombre.\n");
    			br0 = element("br");
    			br1 = element("br");
    			t1 = space();
    			button = element("button");
    			button.textContent = "D'accord";
    			add_location(br0, file$n, 6, 0, 91);
    			add_location(br1, file$n, 6, 5, 96);
    			add_location(button, file$n, 7, 0, 102);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[1], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Interface', slots, []);
    	let { System } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<Interface> was created without expected prop 'System'");
    		}
    	});

    	const writable_props = ['System'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Interface> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		System.pages.change("Menu");
    	};

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({ System });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [System, click_handler];
    }

    let Interface$5 = class Interface extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, { System: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Interface",
    			options,
    			id: create_fragment$o.name
    		});
    	}

    	get System() {
    		throw new Error("<Interface>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Interface>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    };

    class Rien {
        name = "Rien";
        svelte = Interface$5;
    }

    /* src/Events/Fouille/Interface.svelte generated by Svelte v3.59.2 */

    const file$m = "src/Events/Fouille/Interface.svelte";

    // (24:50) 
    function create_if_block_2$9(ctx) {
    	let t0;
    	let br0;
    	let br1;
    	let t1;
    	let button;
    	let mounted;
    	let dispose;

    	function select_block_type_2(ctx, dirty) {
    		if (/*System*/ ctx[0].game.planet.event.money > 0 || /*System*/ ctx[0].game.planet.event.fuel > 0 || /*System*/ ctx[0].game.planet.event.steel > 0) return create_if_block_3$8;
    		return create_else_block_1$5;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			t0 = space();
    			br0 = element("br");
    			br1 = element("br");
    			t1 = space();
    			button = element("button");
    			button.textContent = "Ok";
    			add_location(br0, file$m, 41, 4, 1585);
    			add_location(br1, file$m, 41, 9, 1590);
    			add_location(button, file$m, 42, 4, 1600);
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_2*/ ctx[4], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(t0.parentNode, t0);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$9.name,
    		type: "if",
    		source: "(24:50) ",
    		ctx
    	});

    	return block;
    }

    // (13:0) {#if System.game.planet.event.step == "select"}
    function create_if_block$c(ctx) {
    	let t0;
    	let br0;
    	let br1;
    	let t1;
    	let show_if;
    	let t2;
    	let div;
    	let t3;
    	let t4_value = /*System*/ ctx[0].game.ship.getPart("Moteurs").move() + "";
    	let t4;
    	let t5;
    	let t6;
    	let br2;
    	let t7;
    	let button;
    	let mounted;
    	let dispose;

    	function select_block_type_1(ctx, dirty) {
    		if (dirty & /*System*/ 1) show_if = null;
    		if (show_if == null) show_if = !!(/*System*/ ctx[0].game.ship.fuel >= /*System*/ ctx[0].game.ship.getPart("Moteurs").move());
    		if (show_if) return create_if_block_1$a;
    		return create_else_block$9;
    	}

    	let current_block_type = select_block_type_1(ctx, -1);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			t0 = text("Vous trouvez un campement abandonné sur la planète.\n    ");
    			br0 = element("br");
    			br1 = element("br");
    			t1 = space();
    			if_block.c();
    			t2 = space();
    			div = element("div");
    			t3 = text("-");
    			t4 = text(t4_value);
    			t5 = text(" Carburant");
    			t6 = space();
    			br2 = element("br");
    			t7 = space();
    			button = element("button");
    			button.textContent = "Ne pas y aller";
    			add_location(br0, file$m, 14, 4, 448);
    			add_location(br1, file$m, 14, 9, 453);
    			attr_dev(div, "class", "cost");
    			add_location(div, file$m, 20, 4, 678);
    			add_location(br2, file$m, 21, 4, 762);
    			add_location(button, file$m, 22, 4, 772);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t1, anchor);
    			if_block.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, t3);
    			append_dev(div, t4);
    			append_dev(div, t5);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, br2, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[3], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(t2.parentNode, t2);
    				}
    			}

    			if (dirty & /*System*/ 1 && t4_value !== (t4_value = /*System*/ ctx[0].game.ship.getPart("Moteurs").move() + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t1);
    			if_block.d(detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(br2);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(13:0) {#if System.game.planet.event.step == \\\"select\\\"}",
    		ctx
    	});

    	return block;
    }

    // (39:4) {:else}
    function create_else_block_1$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Vous ne trouvez rien.");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$5.name,
    		type: "else",
    		source: "(39:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (25:4) {#if System.game.planet.event.money > 0 || System.game.planet.event.fuel > 0 || System.game.planet.event.steel > 0}
    function create_if_block_3$8(ctx) {
    	let t0;
    	let br;
    	let t1;
    	let t2;
    	let t3;
    	let if_block2_anchor;
    	let if_block0 = /*System*/ ctx[0].game.planet.event.fuel > 0 && create_if_block_6$2(ctx);
    	let if_block1 = /*System*/ ctx[0].game.planet.event.steel > 0 && create_if_block_5$2(ctx);
    	let if_block2 = /*System*/ ctx[0].game.planet.event.money > 0 && create_if_block_4$4(ctx);

    	const block = {
    		c: function create() {
    			t0 = text("Vous trouvez quelques ressources.\n        ");
    			br = element("br");
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			if (if_block2) if_block2.c();
    			if_block2_anchor = empty();
    			add_location(br, file$m, 26, 8, 1072);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, br, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t3, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, if_block2_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*System*/ ctx[0].game.planet.event.fuel > 0) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_6$2(ctx);
    					if_block0.c();
    					if_block0.m(t2.parentNode, t2);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*System*/ ctx[0].game.planet.event.steel > 0) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_5$2(ctx);
    					if_block1.c();
    					if_block1.m(t3.parentNode, t3);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*System*/ ctx[0].game.planet.event.money > 0) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_4$4(ctx);
    					if_block2.c();
    					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t1);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t3);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(if_block2_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$8.name,
    		type: "if",
    		source: "(25:4) {#if System.game.planet.event.money > 0 || System.game.planet.event.fuel > 0 || System.game.planet.event.steel > 0}",
    		ctx
    	});

    	return block;
    }

    // (28:8) {#if System.game.planet.event.fuel > 0}
    function create_if_block_6$2(ctx) {
    	let div;
    	let t0;
    	let t1_value = /*System*/ ctx[0].game.planet.event.fuel + "";
    	let t1;
    	let t2;
    	let t3;
    	let br;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("+ ");
    			t1 = text(t1_value);
    			t2 = text(" Carburant");
    			t3 = space();
    			br = element("br");
    			attr_dev(div, "class", "win");
    			add_location(div, file$m, 28, 12, 1138);
    			add_location(br, file$m, 29, 12, 1217);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, br, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*System*/ 1 && t1_value !== (t1_value = /*System*/ ctx[0].game.planet.event.fuel + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(br);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$2.name,
    		type: "if",
    		source: "(28:8) {#if System.game.planet.event.fuel > 0}",
    		ctx
    	});

    	return block;
    }

    // (32:8) {#if System.game.planet.event.steel > 0}
    function create_if_block_5$2(ctx) {
    	let div;
    	let t0;
    	let t1_value = /*System*/ ctx[0].game.planet.event.steel + "";
    	let t1;
    	let t2;
    	let t3;
    	let br;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("+ ");
    			t1 = text(t1_value);
    			t2 = text(" Acier");
    			t3 = space();
    			br = element("br");
    			attr_dev(div, "class", "win");
    			add_location(div, file$m, 32, 12, 1298);
    			add_location(br, file$m, 33, 12, 1374);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, br, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*System*/ 1 && t1_value !== (t1_value = /*System*/ ctx[0].game.planet.event.steel + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(br);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$2.name,
    		type: "if",
    		source: "(32:8) {#if System.game.planet.event.steel > 0}",
    		ctx
    	});

    	return block;
    }

    // (36:8) {#if System.game.planet.event.money > 0}
    function create_if_block_4$4(ctx) {
    	let div;
    	let t0;
    	let t1_value = /*System*/ ctx[0].game.planet.event.money + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("+ ");
    			t1 = text(t1_value);
    			t2 = text(" $");
    			attr_dev(div, "class", "win");
    			add_location(div, file$m, 36, 12, 1455);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*System*/ 1 && t1_value !== (t1_value = /*System*/ ctx[0].game.planet.event.money + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$4.name,
    		type: "if",
    		source: "(36:8) {#if System.game.planet.event.money > 0}",
    		ctx
    	});

    	return block;
    }

    // (18:4) {:else}
    function create_else_block$9(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Le fouiller";
    			attr_dev(button, "class", "lock");
    			add_location(button, file$m, 18, 8, 622);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$9.name,
    		type: "else",
    		source: "(18:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (16:4) {#if System.game.ship.fuel >= System.game.ship.getPart("Moteurs").move()}
    function create_if_block_1$a(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Le fouiller";
    			add_location(button, file$m, 16, 8, 545);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$a.name,
    		type: "if",
    		source: "(16:4) {#if System.game.ship.fuel >= System.game.ship.getPart(\\\"Moteurs\\\").move()}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*System*/ ctx[0].game.planet.event.step == "select") return create_if_block$c;
    		if (/*System*/ ctx[0].game.planet.event.step == "loot") return create_if_block_2$9;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Interface', slots, []);
    	let { System } = $$props;

    	let action = function () {
    		$$invalidate(0, System.game.steel += System.game.planet.event.steel, System);
    		$$invalidate(0, System.game.money += System.game.planet.event.money, System);
    		$$invalidate(0, System.game.ship.fuel -= System.game.ship.getPart("Moteurs").move(), System);
    		$$invalidate(0, System.game.planet.event.step = "loot", System);
    	};

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<Interface> was created without expected prop 'System'");
    		}
    	});

    	const writable_props = ['System'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Interface> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		action();
    	};

    	const click_handler_1 = () => {
    		System.pages.change("Menu");
    	};

    	const click_handler_2 = () => {
    		System.pages.change("Menu");
    	};

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({ System, action });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    		if ('action' in $$props) $$invalidate(1, action = $$props.action);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [System, action, click_handler, click_handler_1, click_handler_2];
    }

    let Interface$4 = class Interface extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, { System: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Interface",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get System() {
    		throw new Error("<Interface>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Interface>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    };

    class Fouille {
        name = "Fouille";
        svelte = Interface$4;
        steel;
        money;
        step 
        step = "select";

        constructor (System, level) {
            this.steel = 5*level + parseInt(Math.random()*5*level);
            this.money = 5*level + parseInt(Math.random()*5*level);
        }
    }

    /* src/Bar.svelte generated by Svelte v3.59.2 */

    const file$l = "src/Bar.svelte";

    function create_fragment$m(ctx) {
    	let div1;
    	let div0;
    	let div0_style_value;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let t7;
    	let t8;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			t1 = text(/*name*/ ctx[0]);
    			t2 = text(" : ");
    			t3 = text(/*ratio*/ ctx[4]);
    			t4 = text("% (");
    			t5 = text(/*value*/ ctx[1]);
    			t6 = text("/");
    			t7 = text(/*max*/ ctx[2]);
    			t8 = text(")");
    			attr_dev(div0, "class", "value svelte-22f9s0");
    			attr_dev(div0, "style", div0_style_value = "width:" + /*ratio*/ ctx[4] + "%;background:" + /*color*/ ctx[3] + ";");
    			add_location(div0, file$l, 14, 4, 213);
    			attr_dev(div1, "class", "bar svelte-22f9s0");
    			add_location(div1, file$l, 13, 0, 191);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, t8, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*ratio, color*/ 24 && div0_style_value !== (div0_style_value = "width:" + /*ratio*/ ctx[4] + "%;background:" + /*color*/ ctx[3] + ";")) {
    				attr_dev(div0, "style", div0_style_value);
    			}

    			if (dirty & /*name*/ 1) set_data_dev(t1, /*name*/ ctx[0]);
    			if (dirty & /*ratio*/ 16) set_data_dev(t3, /*ratio*/ ctx[4]);
    			if (dirty & /*value*/ 2) set_data_dev(t5, /*value*/ ctx[1]);
    			if (dirty & /*max*/ 4) set_data_dev(t7, /*max*/ ctx[2]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(t8);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let ratio;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Bar', slots, []);
    	let { name } = $$props;
    	let { value } = $$props;
    	let { max } = $$props;
    	let { color } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (name === undefined && !('name' in $$props || $$self.$$.bound[$$self.$$.props['name']])) {
    			console.warn("<Bar> was created without expected prop 'name'");
    		}

    		if (value === undefined && !('value' in $$props || $$self.$$.bound[$$self.$$.props['value']])) {
    			console.warn("<Bar> was created without expected prop 'value'");
    		}

    		if (max === undefined && !('max' in $$props || $$self.$$.bound[$$self.$$.props['max']])) {
    			console.warn("<Bar> was created without expected prop 'max'");
    		}

    		if (color === undefined && !('color' in $$props || $$self.$$.bound[$$self.$$.props['color']])) {
    			console.warn("<Bar> was created without expected prop 'color'");
    		}
    	});

    	const writable_props = ['name', 'value', 'max', 'color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Bar> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('value' in $$props) $$invalidate(1, value = $$props.value);
    		if ('max' in $$props) $$invalidate(2, max = $$props.max);
    		if ('color' in $$props) $$invalidate(3, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ name, value, max, color, ratio });

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('value' in $$props) $$invalidate(1, value = $$props.value);
    		if ('max' in $$props) $$invalidate(2, max = $$props.max);
    		if ('color' in $$props) $$invalidate(3, color = $$props.color);
    		if ('ratio' in $$props) $$invalidate(4, ratio = $$props.ratio);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*value, max*/ 6) {
    			$$invalidate(4, ratio = parseInt(100 * (value / max)));
    		}
    	};

    	return [name, value, max, color, ratio];
    }

    class Bar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, { name: 0, value: 1, max: 2, color: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Bar",
    			options,
    			id: create_fragment$m.name
    		});
    	}

    	get name() {
    		throw new Error("<Bar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Bar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Bar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Bar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<Bar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<Bar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Bar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Bar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Events/Marchand/Interface.svelte generated by Svelte v3.59.2 */
    const file$k = "src/Events/Marchand/Interface.svelte";

    function get_each_context$9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[21] = list[i];
    	return child_ctx;
    }

    // (102:49) 
    function create_if_block_8$1(ctx) {
    	let t0;
    	let br0;
    	let t1;
    	let t2_value = /*System*/ ctx[0].game.money + "";
    	let t2;
    	let t3;
    	let br1;
    	let br2;
    	let t4;
    	let button;
    	let t6;
    	let br3;
    	let t7;
    	let div;
    	let mounted;
    	let dispose;
    	let each_value = /*System*/ ctx[0].game.planet.event.parts;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$9(get_each_context$9(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			t0 = text("Choississez un nouveau module à acheter :\n    ");
    			br0 = element("br");
    			t1 = space();
    			t2 = text(t2_value);
    			t3 = text(" $\n    ");
    			br1 = element("br");
    			br2 = element("br");
    			t4 = space();
    			button = element("button");
    			button.textContent = "Retour";
    			t6 = space();
    			br3 = element("br");
    			t7 = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(br0, file$k, 103, 4, 3584);
    			add_location(br1, file$k, 105, 4, 3620);
    			add_location(br2, file$k, 105, 9, 3625);
    			add_location(button, file$k, 106, 4, 3635);
    			add_location(br3, file$k, 107, 4, 3721);
    			attr_dev(div, "class", "container svelte-1tczzb8");
    			add_location(div, file$k, 108, 4, 3731);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, br2, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, button, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, br3, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div, null);
    				}
    			}

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_12*/ ctx[19], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*System*/ 1 && t2_value !== (t2_value = /*System*/ ctx[0].game.money + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*System, price, buy*/ 97) {
    				each_value = /*System*/ ctx[0].game.planet.event.parts;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$9(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$9(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(br2);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(br3);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8$1.name,
    		type: "if",
    		source: "(102:49) ",
    		ctx
    	});

    	return block;
    }

    // (78:56) 
    function create_if_block_5$1(ctx) {
    	let t0;
    	let br0;
    	let t1;
    	let t2_value = /*System*/ ctx[0].game.ship.fuel + "";
    	let t2;
    	let t3;
    	let br1;
    	let t4;
    	let t5_value = /*System*/ ctx[0].game.steel + "";
    	let t5;
    	let t6;
    	let br2;
    	let t7;
    	let t8_value = /*System*/ ctx[0].game.money + "";
    	let t8;
    	let t9;
    	let br3;
    	let br4;
    	let t10;
    	let button;
    	let t12;
    	let br5;
    	let t13;
    	let show_if_1;
    	let t14;
    	let div0;
    	let t18;
    	let br6;
    	let t19;
    	let show_if;
    	let t20;
    	let div1;
    	let mounted;
    	let dispose;

    	function select_block_type_3(ctx, dirty) {
    		if (dirty & /*System*/ 1) show_if_1 = null;
    		if (show_if_1 == null) show_if_1 = !!(/*System*/ ctx[0].game.money >= /*price*/ ctx[5](10));
    		if (show_if_1) return create_if_block_7$1;
    		return create_else_block_3;
    	}

    	let current_block_type = select_block_type_3(ctx, -1);
    	let if_block0 = current_block_type(ctx);

    	function select_block_type_4(ctx, dirty) {
    		if (dirty & /*System*/ 1) show_if = null;
    		if (show_if == null) show_if = !!(/*System*/ ctx[0].game.money >= /*price*/ ctx[5](10));
    		if (show_if) return create_if_block_6$1;
    		return create_else_block_2$2;
    	}

    	let current_block_type_1 = select_block_type_4(ctx, -1);
    	let if_block1 = current_block_type_1(ctx);

    	const block = {
    		c: function create() {
    			t0 = text("Achetez les différentes ressources disponibles :\n    ");
    			br0 = element("br");
    			t1 = space();
    			t2 = text(t2_value);
    			t3 = text(" Carburant\n    ");
    			br1 = element("br");
    			t4 = space();
    			t5 = text(t5_value);
    			t6 = text(" Acier\n    ");
    			br2 = element("br");
    			t7 = space();
    			t8 = text(t8_value);
    			t9 = text(" $\n    ");
    			br3 = element("br");
    			br4 = element("br");
    			t10 = space();
    			button = element("button");
    			button.textContent = "Retour";
    			t12 = space();
    			br5 = element("br");
    			t13 = space();
    			if_block0.c();
    			t14 = space();
    			div0 = element("div");
    			div0.textContent = `-${/*price*/ ctx[5](10)} \$`;
    			t18 = space();
    			br6 = element("br");
    			t19 = space();
    			if_block1.c();
    			t20 = space();
    			div1 = element("div");
    			div1.textContent = `-${/*price*/ ctx[5](10)} \$`;
    			add_location(br0, file$k, 79, 4, 2802);
    			add_location(br1, file$k, 81, 4, 2850);
    			add_location(br2, file$k, 83, 4, 2890);
    			add_location(br3, file$k, 85, 4, 2926);
    			add_location(br4, file$k, 85, 9, 2931);
    			add_location(button, file$k, 86, 4, 2941);
    			add_location(br5, file$k, 87, 4, 3027);
    			attr_dev(div0, "class", "cost");
    			add_location(div0, file$k, 93, 4, 3218);
    			add_location(br6, file$k, 94, 4, 3261);
    			attr_dev(div1, "class", "cost");
    			add_location(div1, file$k, 100, 4, 3445);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, br2, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, br3, anchor);
    			insert_dev(target, br4, anchor);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, button, anchor);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, br5, anchor);
    			insert_dev(target, t13, anchor);
    			if_block0.m(target, anchor);
    			insert_dev(target, t14, anchor);
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t18, anchor);
    			insert_dev(target, br6, anchor);
    			insert_dev(target, t19, anchor);
    			if_block1.m(target, anchor);
    			insert_dev(target, t20, anchor);
    			insert_dev(target, div1, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_9*/ ctx[16], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*System*/ 1 && t2_value !== (t2_value = /*System*/ ctx[0].game.ship.fuel + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*System*/ 1 && t5_value !== (t5_value = /*System*/ ctx[0].game.steel + "")) set_data_dev(t5, t5_value);
    			if (dirty & /*System*/ 1 && t8_value !== (t8_value = /*System*/ ctx[0].game.money + "")) set_data_dev(t8, t8_value);

    			if (current_block_type === (current_block_type = select_block_type_3(ctx, dirty)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(t14.parentNode, t14);
    				}
    			}

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_4(ctx, dirty)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type_1(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(t20.parentNode, t20);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(br2);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(br3);
    			if (detaching) detach_dev(br4);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(br5);
    			if (detaching) detach_dev(t13);
    			if_block0.d(detaching);
    			if (detaching) detach_dev(t14);
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t18);
    			if (detaching) detach_dev(br6);
    			if (detaching) detach_dev(t19);
    			if_block1.d(detaching);
    			if (detaching) detach_dev(t20);
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(78:56) ",
    		ctx
    	});

    	return block;
    }

    // (54:52) 
    function create_if_block_2$8(ctx) {
    	let t0;
    	let br0;
    	let br1;
    	let t1;
    	let switch_instance;
    	let t2;
    	let br2;
    	let t3;
    	let t4_value = /*System*/ ctx[0].game.steel + "";
    	let t4;
    	let t5;
    	let br3;
    	let t6;
    	let t7_value = /*System*/ ctx[0].game.money + "";
    	let t7;
    	let t8;
    	let br4;
    	let br5;
    	let t9;
    	let button;
    	let t11;
    	let br6;
    	let t12;
    	let show_if_1;
    	let t13;
    	let div0;
    	let t15;
    	let br7;
    	let t16;
    	let show_if;
    	let t17;
    	let div1;
    	let current;
    	let mounted;
    	let dispose;
    	var switch_value = Bar;

    	function switch_props(ctx) {
    		return {
    			props: {
    				name: "Vie",
    				value: /*System*/ ctx[0].game.ship.life,
    				max: /*System*/ ctx[0].game.ship.life_max(),
    				color: "green"
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	function select_block_type_1(ctx, dirty) {
    		if (dirty & /*System*/ 1) show_if_1 = null;
    		if (show_if_1 == null) show_if_1 = !!(/*System*/ ctx[0].game.ship.life < /*System*/ ctx[0].game.ship.life_max() && /*System*/ ctx[0].game.steel >= 3);
    		if (show_if_1) return create_if_block_4$3;
    		return create_else_block_1$4;
    	}

    	let current_block_type = select_block_type_1(ctx, -1);
    	let if_block0 = current_block_type(ctx);

    	function select_block_type_2(ctx, dirty) {
    		if (dirty & /*System*/ 1) show_if = null;
    		if (show_if == null) show_if = !!(/*System*/ ctx[0].game.ship.life < /*System*/ ctx[0].game.ship.life_max() && /*System*/ ctx[0].game.money >= /*price*/ ctx[5](3));
    		if (show_if) return create_if_block_3$7;
    		return create_else_block$8;
    	}

    	let current_block_type_1 = select_block_type_2(ctx, -1);
    	let if_block1 = current_block_type_1(ctx);

    	const block = {
    		c: function create() {
    			t0 = text("Réparer les dégâts occasionnés à votre vaisseau :\n    ");
    			br0 = element("br");
    			br1 = element("br");
    			t1 = space();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			t2 = space();
    			br2 = element("br");
    			t3 = space();
    			t4 = text(t4_value);
    			t5 = text(" Acier\n    ");
    			br3 = element("br");
    			t6 = space();
    			t7 = text(t7_value);
    			t8 = text(" $\n    ");
    			br4 = element("br");
    			br5 = element("br");
    			t9 = space();
    			button = element("button");
    			button.textContent = "Retour";
    			t11 = space();
    			br6 = element("br");
    			t12 = space();
    			if_block0.c();
    			t13 = space();
    			div0 = element("div");
    			div0.textContent = "-3 Acier";
    			t15 = space();
    			br7 = element("br");
    			t16 = space();
    			if_block1.c();
    			t17 = space();
    			div1 = element("div");
    			div1.textContent = `-${/*price*/ ctx[5](3)} \$`;
    			add_location(br0, file$k, 55, 4, 1794);
    			add_location(br1, file$k, 55, 9, 1799);
    			add_location(br2, file$k, 57, 4, 1937);
    			add_location(br3, file$k, 59, 4, 1977);
    			add_location(br4, file$k, 61, 4, 2013);
    			add_location(br5, file$k, 61, 9, 2018);
    			add_location(button, file$k, 62, 4, 2028);
    			add_location(br6, file$k, 63, 4, 2114);
    			attr_dev(div0, "class", "cost");
    			add_location(div0, file$k, 69, 4, 2360);
    			add_location(br7, file$k, 70, 4, 2397);
    			attr_dev(div1, "class", "cost");
    			add_location(div1, file$k, 76, 4, 2650);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t1, anchor);
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, br2, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, br3, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, br4, anchor);
    			insert_dev(target, br5, anchor);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, button, anchor);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, br6, anchor);
    			insert_dev(target, t12, anchor);
    			if_block0.m(target, anchor);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, br7, anchor);
    			insert_dev(target, t16, anchor);
    			if_block1.m(target, anchor);
    			insert_dev(target, t17, anchor);
    			insert_dev(target, div1, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_6*/ ctx[13], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*System*/ 1) switch_instance_changes.value = /*System*/ ctx[0].game.ship.life;
    			if (dirty & /*System*/ 1) switch_instance_changes.max = /*System*/ ctx[0].game.ship.life_max();

    			if (switch_value !== (switch_value = Bar)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, t2.parentNode, t2);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}

    			if ((!current || dirty & /*System*/ 1) && t4_value !== (t4_value = /*System*/ ctx[0].game.steel + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty & /*System*/ 1) && t7_value !== (t7_value = /*System*/ ctx[0].game.money + "")) set_data_dev(t7, t7_value);

    			if (current_block_type === (current_block_type = select_block_type_1(ctx, dirty)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(t13.parentNode, t13);
    				}
    			}

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_2(ctx, dirty)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type_1(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(t17.parentNode, t17);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t1);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(br2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(br3);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(br4);
    			if (detaching) detach_dev(br5);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(br6);
    			if (detaching) detach_dev(t12);
    			if_block0.d(detaching);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(br7);
    			if (detaching) detach_dev(t16);
    			if_block1.d(detaching);
    			if (detaching) detach_dev(t17);
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$8.name,
    		type: "if",
    		source: "(54:52) ",
    		ctx
    	});

    	return block;
    }

    // (44:50) 
    function create_if_block_1$9(ctx) {
    	let t0;
    	let br0;
    	let br1;
    	let t1;
    	let button0;
    	let t3;
    	let br2;
    	let t4;
    	let button1;
    	let t6;
    	let br3;
    	let t7;
    	let button2;
    	let t9;
    	let br4;
    	let t10;
    	let button3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			t0 = text("Le vaisseau vous propose différents modules, ressources et peut améliorer votre vaisseau.\n    ");
    			br0 = element("br");
    			br1 = element("br");
    			t1 = space();
    			button0 = element("button");
    			button0.textContent = "Réparer le vaisseau";
    			t3 = space();
    			br2 = element("br");
    			t4 = space();
    			button1 = element("button");
    			button1.textContent = "Acheter des ressources";
    			t6 = space();
    			br3 = element("br");
    			t7 = space();
    			button2 = element("button");
    			button2.textContent = "Acheter de nouveaux modules";
    			t9 = space();
    			br4 = element("br");
    			t10 = space();
    			button3 = element("button");
    			button3.textContent = "Partir";
    			add_location(br0, file$k, 45, 4, 1252);
    			add_location(br1, file$k, 45, 9, 1257);
    			add_location(button0, file$k, 46, 4, 1267);
    			add_location(br2, file$k, 47, 4, 1368);
    			add_location(button1, file$k, 48, 4, 1378);
    			add_location(br3, file$k, 49, 4, 1486);
    			add_location(button2, file$k, 50, 4, 1496);
    			add_location(br4, file$k, 51, 4, 1602);
    			add_location(button3, file$k, 52, 4, 1612);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, br2, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, button1, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, br3, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, button2, anchor);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, br4, anchor);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, button3, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler_2*/ ctx[9], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_3*/ ctx[10], false, false, false, false),
    					listen_dev(button2, "click", /*click_handler_4*/ ctx[11], false, false, false, false),
    					listen_dev(button3, "click", /*click_handler_5*/ ctx[12], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(br2);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(button1);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(br3);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(button2);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(br4);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(button3);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$9.name,
    		type: "if",
    		source: "(44:50) ",
    		ctx
    	});

    	return block;
    }

    // (38:0) {#if System.game.planet.event.step == "select"}
    function create_if_block$b(ctx) {
    	let t0;
    	let br0;
    	let br1;
    	let t1;
    	let button0;
    	let t3;
    	let br2;
    	let t4;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			t0 = text("Vous croisez un vaisseau marchand.\n    ");
    			br0 = element("br");
    			br1 = element("br");
    			t1 = space();
    			button0 = element("button");
    			button0.textContent = "L'accoster";
    			t3 = space();
    			br2 = element("br");
    			t4 = space();
    			button1 = element("button");
    			button1.textContent = "Ne pas s'arrêter";
    			add_location(br0, file$k, 39, 4, 909);
    			add_location(br1, file$k, 39, 9, 914);
    			add_location(button0, file$k, 40, 4, 924);
    			add_location(br2, file$k, 41, 4, 1012);
    			add_location(button1, file$k, 42, 4, 1022);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, br2, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, button1, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[7], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[8], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(br2);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(button1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(38:0) {#if System.game.planet.event.step == \\\"select\\\"}",
    		ctx
    	});

    	return block;
    }

    // (126:12) {:else}
    function create_else_block_5(ctx) {
    	let div0;
    	let button;
    	let t0_value = /*part*/ ctx[21].name + "";
    	let t0;
    	let t1;
    	let div1;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			div1.textContent = "Déjà acquis";
    			add_location(button, file$k, 127, 20, 4619);
    			add_location(div0, file$k, 126, 16, 4593);
    			add_location(div1, file$k, 129, 16, 4687);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, button);
    			append_dev(button, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*System*/ 1 && t0_value !== (t0_value = /*part*/ ctx[21].name + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_5.name,
    		type: "else",
    		source: "(126:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (111:12) {#if !System.game.ship.checkPart(part.name)}
    function create_if_block_9$1(ctx) {
    	let div0;
    	let show_if;
    	let t0;
    	let div2;
    	let div1;
    	let t1;
    	let t2_value = /*price*/ ctx[5](/*part*/ ctx[21].levels[0].price) + "";
    	let t2;
    	let t3;

    	function select_block_type_6(ctx, dirty) {
    		if (dirty & /*System*/ 1) show_if = null;
    		if (show_if == null) show_if = !!(/*System*/ ctx[0].game.money >= /*price*/ ctx[5](/*part*/ ctx[21].levels[0].price));
    		if (show_if) return create_if_block_10$1;
    		return create_else_block_4;
    	}

    	let current_block_type = select_block_type_6(ctx, -1);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			if_block.c();
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			t1 = text("-");
    			t2 = text(t2_value);
    			t3 = text(" $");
    			add_location(div0, file$k, 111, 16, 3883);
    			attr_dev(div1, "class", "cost");
    			add_location(div1, file$k, 123, 20, 4477);
    			add_location(div2, file$k, 122, 16, 4451);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			if_block.m(div0, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, t1);
    			append_dev(div1, t2);
    			append_dev(div1, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_6(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			}

    			if (dirty & /*System*/ 1 && t2_value !== (t2_value = /*price*/ ctx[5](/*part*/ ctx[21].levels[0].price) + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if_block.d();
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9$1.name,
    		type: "if",
    		source: "(111:12) {#if !System.game.ship.checkPart(part.name)}",
    		ctx
    	});

    	return block;
    }

    // (119:20) {:else}
    function create_else_block_4(ctx) {
    	let button;
    	let t_value = /*part*/ ctx[21].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "lock");
    			add_location(button, file$k, 119, 24, 4344);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*System*/ 1 && t_value !== (t_value = /*part*/ ctx[21].name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_4.name,
    		type: "else",
    		source: "(119:20) {:else}",
    		ctx
    	});

    	return block;
    }

    // (113:20) {#if System.game.money >= price(part.levels[0].price)}
    function create_if_block_10$1(ctx) {
    	let button;
    	let t_value = /*part*/ ctx[21].name + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_13() {
    		return /*click_handler_13*/ ctx[20](/*part*/ ctx[21]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			add_location(button, file$k, 113, 24, 3988);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_13, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*System*/ 1 && t_value !== (t_value = /*part*/ ctx[21].name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10$1.name,
    		type: "if",
    		source: "(113:20) {#if System.game.money >= price(part.levels[0].price)}",
    		ctx
    	});

    	return block;
    }

    // (110:8) {#each System.game.planet.event.parts as part}
    function create_each_block$9(ctx) {
    	let show_if;
    	let t0;
    	let div;
    	let t1_value = /*part*/ ctx[21].description + "";
    	let t1;
    	let t2;

    	function select_block_type_5(ctx, dirty) {
    		if (dirty & /*System*/ 1) show_if = null;
    		if (show_if == null) show_if = !!!/*System*/ ctx[0].game.ship.checkPart(/*part*/ ctx[21].name);
    		if (show_if) return create_if_block_9$1;
    		return create_else_block_5;
    	}

    	let current_block_type = select_block_type_5(ctx, -1);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			t0 = space();
    			div = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			add_location(div, file$k, 133, 12, 4778);
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, t1);
    			append_dev(div, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_5(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(t0.parentNode, t0);
    				}
    			}

    			if (dirty & /*System*/ 1 && t1_value !== (t1_value = /*part*/ ctx[21].description + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$9.name,
    		type: "each",
    		source: "(110:8) {#each System.game.planet.event.parts as part}",
    		ctx
    	});

    	return block;
    }

    // (91:4) {:else}
    function create_else_block_3(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "10 Carburant";
    			attr_dev(button, "class", "lock");
    			add_location(button, file$k, 91, 8, 3161);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_3.name,
    		type: "else",
    		source: "(91:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (89:4) {#if System.game.money >= price(10)}
    function create_if_block_7$1(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "10 Carburant";
    			add_location(button, file$k, 89, 8, 3082);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_10*/ ctx[17], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$1.name,
    		type: "if",
    		source: "(89:4) {#if System.game.money >= price(10)}",
    		ctx
    	});

    	return block;
    }

    // (98:4) {:else}
    function create_else_block_2$2(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "10 Acier";
    			attr_dev(button, "class", "lock");
    			add_location(button, file$k, 98, 8, 3392);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2$2.name,
    		type: "else",
    		source: "(98:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (96:4) {#if System.game.money >= price(10)}
    function create_if_block_6$1(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "10 Acier";
    			add_location(button, file$k, 96, 8, 3316);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_11*/ ctx[18], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$1.name,
    		type: "if",
    		source: "(96:4) {#if System.game.money >= price(10)}",
    		ctx
    	});

    	return block;
    }

    // (67:4) {:else}
    function create_else_block_1$4(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "1 Point de vie";
    			attr_dev(button, "class", "lock");
    			add_location(button, file$k, 67, 8, 2301);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$4.name,
    		type: "else",
    		source: "(67:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (65:4) {#if System.game.ship.life < System.game.ship.life_max() && System.game.steel >= 3}
    function create_if_block_4$3(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "1 Point de vie";
    			add_location(button, file$k, 65, 8, 2216);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_7*/ ctx[14], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$3.name,
    		type: "if",
    		source: "(65:4) {#if System.game.ship.life < System.game.ship.life_max() && System.game.steel >= 3}",
    		ctx
    	});

    	return block;
    }

    // (74:4) {:else}
    function create_else_block$8(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "1 Point de vie";
    			attr_dev(button, "class", "lock");
    			add_location(button, file$k, 74, 8, 2591);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$8.name,
    		type: "else",
    		source: "(74:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (72:4) {#if System.game.ship.life < System.game.ship.life_max() && System.game.money >= price(3)}
    function create_if_block_3$7(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "1 Point de vie";
    			add_location(button, file$k, 72, 8, 2506);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_8*/ ctx[15], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$7.name,
    		type: "if",
    		source: "(72:4) {#if System.game.ship.life < System.game.ship.life_max() && System.game.money >= price(3)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;

    	const if_block_creators = [
    		create_if_block$b,
    		create_if_block_1$9,
    		create_if_block_2$8,
    		create_if_block_5$1,
    		create_if_block_8$1
    	];

    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*System*/ ctx[0].game.planet.event.step == "select") return 0;
    		if (/*System*/ ctx[0].game.planet.event.step == "shop") return 1;
    		if (/*System*/ ctx[0].game.planet.event.step == "repare") return 2;
    		if (/*System*/ ctx[0].game.planet.event.step == "ressources") return 3;
    		if (/*System*/ ctx[0].game.planet.event.step == "buy") return 4;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Interface', slots, []);
    	let { System } = $$props;

    	function repareSteel() {
    		$$invalidate(0, System.game.steel -= 3, System);
    		System.game.ship.heal(1);
    	}

    	function repareMoney() {
    		buy(price(3));
    		System.game.ship.useSkill("Commerce", 2);
    		System.game.ship.heal(1);
    	}

    	function buyFuel() {
    		buy(price(10));
    		System.game.ship.useSkill("Commerce", 2);
    		$$invalidate(0, System.game.ship.fuel += 10, System);
    	}

    	function buySteel() {
    		buy(price(10));
    		System.game.ship.useSkill("Commerce", 2);
    		$$invalidate(0, System.game.steel += 10, System);
    	}

    	function price(value) {
    		return Math.round(value * (1 - 0.05 * System.game.ship.totalSkill("Commerce")));
    	}

    	function buy(value) {
    		$$invalidate(0, System.game.money -= value, System);
    	}

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<Interface> was created without expected prop 'System'");
    		}
    	});

    	const writable_props = ['System'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Interface> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		$$invalidate(0, System.game.planet.event.step = "shop", System);
    	};

    	const click_handler_1 = () => {
    		System.pages.change("Menu");
    	};

    	const click_handler_2 = () => {
    		$$invalidate(0, System.game.planet.event.step = "repare", System);
    	};

    	const click_handler_3 = () => {
    		$$invalidate(0, System.game.planet.event.step = "ressources", System);
    	};

    	const click_handler_4 = () => {
    		$$invalidate(0, System.game.planet.event.step = "buy", System);
    	};

    	const click_handler_5 = () => {
    		System.pages.change("Menu");
    	};

    	const click_handler_6 = () => {
    		$$invalidate(0, System.game.planet.event.step = "shop", System);
    	};

    	const click_handler_7 = () => {
    		repareSteel();
    	};

    	const click_handler_8 = () => {
    		repareMoney();
    	};

    	const click_handler_9 = () => {
    		$$invalidate(0, System.game.planet.event.step = "shop", System);
    	};

    	const click_handler_10 = () => {
    		buyFuel();
    	};

    	const click_handler_11 = () => {
    		buySteel();
    	};

    	const click_handler_12 = () => {
    		$$invalidate(0, System.game.planet.event.step = "shop", System);
    	};

    	const click_handler_13 = part => {
    		buy(price(part.levels[0].price));
    		System.game.ship.useSkill("Commerce", 50);
    		System.game.ship.addPart(System, System.parts.getByName(part.name));
    	};

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({
    		Bar,
    		System,
    		repareSteel,
    		repareMoney,
    		buyFuel,
    		buySteel,
    		price,
    		buy
    	});

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		System,
    		repareSteel,
    		repareMoney,
    		buyFuel,
    		buySteel,
    		price,
    		buy,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8,
    		click_handler_9,
    		click_handler_10,
    		click_handler_11,
    		click_handler_12,
    		click_handler_13
    	];
    }

    let Interface$3 = class Interface extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, { System: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Interface",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get System() {
    		throw new Error("<Interface>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Interface>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    };

    class Marchand {
        name = "Marchand";
        svelte = Interface$3;
        parts = [];
        step = "select";

        constructor(System, level) {
            let listPart = ["Bouclier", "Cannon léger", "Cannon lourd", "Canon mitrailleur", "Laser", "Blindage", "Scanner", "Catalyseur", "Maintenance", "Extracteur", "Drone de combat", "Drone de réparation", "Aide à la visée", "Tirs perforants", "Tirs explosifs"];
            for (let i = 0; i < 3; i++) {
                let index = parseInt(Math.random()*listPart.length);
                this.parts.push(System.parts.getByName(listPart[index]));
                listPart.splice(index, 1);
            }
        }
    }

    /* src/Events/Collision/Interface.svelte generated by Svelte v3.59.2 */

    const file$j = "src/Events/Collision/Interface.svelte";

    // (34:49) 
    function create_if_block_2$7(ctx) {
    	let t0;
    	let t1_value = /*damage_result*/ ctx[1].total + "";
    	let t1;
    	let t2;
    	let br0;
    	let br1;
    	let t3;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			t0 = text("Votre vaisseau heurte un astéroide sur le chemin, qui occasione ");
    			t1 = text(t1_value);
    			t2 = text(" dégâts.\n    ");
    			br0 = element("br");
    			br1 = element("br");
    			t3 = space();
    			button = element("button");
    			button.textContent = "Ok";
    			add_location(br0, file$j, 35, 4, 1191);
    			add_location(br1, file$j, 35, 9, 1196);
    			add_location(button, file$j, 36, 4, 1206);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_2*/ ctx[6], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*damage_result*/ 2 && t1_value !== (t1_value = /*damage_result*/ ctx[1].total + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$7.name,
    		type: "if",
    		source: "(34:49) ",
    		ctx
    	});

    	return block;
    }

    // (23:0) {#if System.game.planet.event.step == "select"}
    function create_if_block$a(ctx) {
    	let t0;
    	let br0;
    	let br1;
    	let t1;
    	let show_if;
    	let t2;
    	let div;
    	let t3;
    	let t4_value = /*System*/ ctx[0].game.ship.getPart("Moteurs").move() + "";
    	let t4;
    	let t5;
    	let t6;
    	let br2;
    	let t7;
    	let button;
    	let mounted;
    	let dispose;

    	function select_block_type_1(ctx, dirty) {
    		if (dirty & /*System*/ 1) show_if = null;
    		if (show_if == null) show_if = !!(/*System*/ ctx[0].game.ship.fuel >= /*System*/ ctx[0].game.ship.getPart("Moteurs").move());
    		if (show_if) return create_if_block_1$8;
    		return create_else_block$7;
    	}

    	let current_block_type = select_block_type_1(ctx, -1);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			t0 = text("Le champ d'astéroides est particulièrement dense. Voulez vous le contourner ou bien poursuivre votre route ?\n    ");
    			br0 = element("br");
    			br1 = element("br");
    			t1 = space();
    			if_block.c();
    			t2 = space();
    			div = element("div");
    			t3 = text("-");
    			t4 = text(t4_value);
    			t5 = text(" Carburant");
    			t6 = space();
    			br2 = element("br");
    			t7 = space();
    			button = element("button");
    			button.textContent = "Ne pas dévier";
    			add_location(br0, file$j, 24, 4, 654);
    			add_location(br1, file$j, 24, 9, 659);
    			attr_dev(div, "class", "cost");
    			add_location(div, file$j, 30, 4, 885);
    			add_location(br2, file$j, 31, 4, 969);
    			add_location(button, file$j, 32, 4, 979);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t1, anchor);
    			if_block.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, t3);
    			append_dev(div, t4);
    			append_dev(div, t5);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, br2, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[5], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(t2.parentNode, t2);
    				}
    			}

    			if (dirty & /*System*/ 1 && t4_value !== (t4_value = /*System*/ ctx[0].game.ship.getPart("Moteurs").move() + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t1);
    			if_block.d(detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(br2);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(23:0) {#if System.game.planet.event.step == \\\"select\\\"}",
    		ctx
    	});

    	return block;
    }

    // (28:4) {:else}
    function create_else_block$7(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Le coutourner";
    			attr_dev(button, "class", "lock");
    			add_location(button, file$j, 28, 4, 827);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$7.name,
    		type: "else",
    		source: "(28:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (26:4) {#if System.game.ship.fuel >= System.game.ship.getPart("Moteurs").move()}
    function create_if_block_1$8(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Le coutourner";
    			add_location(button, file$j, 26, 8, 751);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[4], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$8.name,
    		type: "if",
    		source: "(26:4) {#if System.game.ship.fuel >= System.game.ship.getPart(\\\"Moteurs\\\").move()}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*System*/ ctx[0].game.planet.event.step == "select") return create_if_block$a;
    		if (/*System*/ ctx[0].game.planet.event.step == "hit") return create_if_block_2$7;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Interface', slots, []);
    	let { System } = $$props;
    	let damage_result;

    	let action1 = function () {
    		$$invalidate(0, System.game.ship.fuel -= System.game.ship.getPart("Moteurs").move(), System);
    		System.pages.change("Menu");
    	};

    	let action2 = function () {
    		if (Math.random() < 0.5) {
    			$$invalidate(1, damage_result = System.game.ship.damage(3));
    			$$invalidate(0, System.game.planet.event.step = "hit", System);
    		} else {
    			System.pages.change("Menu");
    		}
    	};

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<Interface> was created without expected prop 'System'");
    		}
    	});

    	const writable_props = ['System'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Interface> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		action1();
    	};

    	const click_handler_1 = () => {
    		action2();
    	};

    	const click_handler_2 = () => {
    		System.pages.change("Menu");
    	};

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({ System, damage_result, action1, action2 });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    		if ('damage_result' in $$props) $$invalidate(1, damage_result = $$props.damage_result);
    		if ('action1' in $$props) $$invalidate(2, action1 = $$props.action1);
    		if ('action2' in $$props) $$invalidate(3, action2 = $$props.action2);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		System,
    		damage_result,
    		action1,
    		action2,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    let Interface$2 = class Interface extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { System: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Interface",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get System() {
    		throw new Error("<Interface>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Interface>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    };

    class Collision {
        name = "Collision";
        svelte = Interface$2;
        step = "select";
    }

    /* src/Battle.svelte generated by Svelte v3.59.2 */
    const file$i = "src/Battle.svelte";

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    // (14:4) {#if ennemy.shield_max() > 0}
    function create_if_block_10(ctx) {
    	let switch_instance;
    	let t;
    	let br;
    	let current;
    	var switch_value = Bar;

    	function switch_props(ctx) {
    		return {
    			props: {
    				name: "Bouclier",
    				value: /*ennemy*/ ctx[1].shield,
    				max: /*ennemy*/ ctx[1].shield_max(),
    				color: "blue"
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			t = space();
    			br = element("br");
    			add_location(br, file$i, 15, 8, 512);
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, br, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*ennemy*/ 2) switch_instance_changes.value = /*ennemy*/ ctx[1].shield;
    			if (dirty & /*ennemy*/ 2) switch_instance_changes.max = /*ennemy*/ ctx[1].shield_max();

    			if (switch_value !== (switch_value = Bar)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, t.parentNode, t);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (switch_instance) destroy_component(switch_instance, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(br);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(14:4) {#if ennemy.shield_max() > 0}",
    		ctx
    	});

    	return block;
    }

    // (94:48) 
    function create_if_block_9(ctx) {
    	let t0;
    	let br0;
    	let br1;
    	let t1;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			t0 = text("Vous avez réussi à fuir le combat.\n        ");
    			br0 = element("br");
    			br1 = element("br");
    			t1 = space();
    			button = element("button");
    			button.textContent = "Ok";
    			add_location(br0, file$i, 95, 8, 3419);
    			add_location(br1, file$i, 95, 13, 3424);
    			add_location(button, file$i, 96, 8, 3438);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_7*/ ctx[10], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(94:48) ",
    		ctx
    	});

    	return block;
    }

    // (88:51) 
    function create_if_block_8(ctx) {
    	let t0;
    	let br0;
    	let br1;
    	let t1;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			t0 = text("Votre vaisseau est détruit...\n        ");
    			br0 = element("br");
    			br1 = element("br");
    			t1 = space();
    			button = element("button");
    			button.textContent = "Ok";
    			add_location(br0, file$i, 89, 8, 3211);
    			add_location(br1, file$i, 89, 13, 3216);
    			add_location(button, file$i, 90, 8, 3230);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_6*/ ctx[9], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(88:51) ",
    		ctx
    	});

    	return block;
    }

    // (82:52) 
    function create_if_block_7(ctx) {
    	let t0_value = /*ennemy*/ ctx[1].name + "";
    	let t0;
    	let t1;
    	let br0;
    	let br1;
    	let t2;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = text(" est détruit !\n        ");
    			br0 = element("br");
    			br1 = element("br");
    			t2 = space();
    			button = element("button");
    			button.textContent = "Ok";
    			add_location(br0, file$i, 83, 8, 3006);
    			add_location(br1, file$i, 83, 13, 3011);
    			add_location(button, file$i, 84, 8, 3025);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_5*/ ctx[8], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ennemy*/ 2 && t0_value !== (t0_value = /*ennemy*/ ctx[1].name + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(82:52) ",
    		ctx
    	});

    	return block;
    }

    // (76:79) 
    function create_if_block_6(ctx) {
    	let t0_value = /*System*/ ctx[0].game.battle.action_result + "";
    	let t0;
    	let t1;
    	let br0;
    	let br1;
    	let t2;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = space();
    			br0 = element("br");
    			br1 = element("br");
    			t2 = space();
    			button = element("button");
    			button.textContent = "Ok";
    			add_location(br0, file$i, 77, 8, 2802);
    			add_location(br1, file$i, 77, 13, 2807);
    			add_location(button, file$i, 78, 8, 2821);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_4*/ ctx[7], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*System*/ 1 && t0_value !== (t0_value = /*System*/ ctx[0].game.battle.action_result + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(76:79) ",
    		ctx
    	});

    	return block;
    }

    // (21:4) {#if System.game.battle.phase == "select"}
    function create_if_block_1$7(ctx) {
    	let div8;
    	let t0;
    	let div0;
    	let t1;
    	let div2;
    	let t2;
    	let div1;
    	let t4;
    	let div3;
    	let button;
    	let t6;
    	let div4;
    	let t7;
    	let div5;
    	let show_if;
    	let t8;
    	let div7;
    	let div6;
    	let t9;
    	let t10_value = /*System*/ ctx[0].game.ship.getPart("Moteurs").move() + "";
    	let t10;
    	let t11;
    	let mounted;
    	let dispose;
    	let each_value = /*ship*/ ctx[2].parts;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
    	}

    	function select_block_type_2(ctx, dirty) {
    		if (!/*System*/ ctx[0].game.ship.dodge && /*System*/ ctx[0].game.ship.fuel >= 5) return create_if_block_3$6;
    		return create_else_block_1$3;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block0 = current_block_type(ctx);

    	function select_block_type_3(ctx, dirty) {
    		if (dirty & /*System*/ 1) show_if = null;
    		if (show_if == null) show_if = !!(/*System*/ ctx[0].game.ship.fuel >= /*System*/ ctx[0].game.ship.getPart("Moteurs").move());
    		if (show_if) return create_if_block_2$6;
    		return create_else_block$6;
    	}

    	let current_block_type_1 = select_block_type_3(ctx, -1);
    	let if_block1 = current_block_type_1(ctx);

    	const block = {
    		c: function create() {
    			div8 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			div0 = element("div");
    			if_block0.c();
    			t1 = space();
    			div2 = element("div");
    			t2 = text("Augmente le taux d'esquive de 15% jusqu'au prochain tour de combat.\n                ");
    			div1 = element("div");
    			div1.textContent = "-5 Carburant";
    			t4 = space();
    			div3 = element("div");
    			button = element("button");
    			button.textContent = "Tour suivant";
    			t6 = space();
    			div4 = element("div");
    			t7 = space();
    			div5 = element("div");
    			if_block1.c();
    			t8 = space();
    			div7 = element("div");
    			div6 = element("div");
    			t9 = text("-");
    			t10 = text(t10_value);
    			t11 = text(" Carburant");
    			add_location(div0, file$i, 42, 12, 1475);
    			attr_dev(div1, "class", "cost");
    			add_location(div1, file$i, 51, 16, 1905);
    			add_location(div2, file$i, 49, 12, 1799);
    			add_location(button, file$i, 56, 16, 2027);
    			add_location(div3, file$i, 55, 12, 2005);
    			add_location(div4, file$i, 58, 12, 2137);
    			add_location(div5, file$i, 61, 12, 2199);
    			attr_dev(div6, "class", "cost");
    			add_location(div6, file$i, 69, 16, 2535);
    			add_location(div7, file$i, 68, 12, 2513);
    			attr_dev(div8, "class", "container svelte-1vqxtcb");
    			add_location(div8, file$i, 22, 8, 741);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div8, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div8, null);
    				}
    			}

    			append_dev(div8, t0);
    			append_dev(div8, div0);
    			if_block0.m(div0, null);
    			append_dev(div8, t1);
    			append_dev(div8, div2);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div8, t4);
    			append_dev(div8, div3);
    			append_dev(div3, button);
    			append_dev(div8, t6);
    			append_dev(div8, div4);
    			append_dev(div8, t7);
    			append_dev(div8, div5);
    			if_block1.m(div5, null);
    			append_dev(div8, t8);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div6, t9);
    			append_dev(div6, t10);
    			append_dev(div6, t11);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_2*/ ctx[5], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ship, System*/ 5) {
    				each_value = /*ship*/ ctx[2].parts;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$8(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$8(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div8, t0);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div0, null);
    				}
    			}

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_3(ctx, dirty)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type_1(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div5, null);
    				}
    			}

    			if (dirty & /*System*/ 1 && t10_value !== (t10_value = /*System*/ ctx[0].game.ship.getPart("Moteurs").move() + "")) set_data_dev(t10, t10_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div8);
    			destroy_each(each_blocks, detaching);
    			if_block0.d();
    			if_block1.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(21:4) {#if System.game.battle.phase == \\\"select\\\"}",
    		ctx
    	});

    	return block;
    }

    // (27:16) {#if part.weapon}
    function create_if_block_4$2(ctx) {
    	let div0;
    	let show_if;
    	let t0;
    	let div2;
    	let t1_value = /*part*/ ctx[11].attack.description() + "";
    	let t1;
    	let t2;
    	let div1;
    	let t3_value = /*part*/ ctx[11].attack.cost() + "";
    	let t3;
    	let t4;

    	function select_block_type_1(ctx, dirty) {
    		if (dirty & /*ship*/ 4) show_if = null;
    		if (show_if == null) show_if = !!/*part*/ ctx[11].attack.need(/*ship*/ ctx[2]);
    		if (show_if) return create_if_block_5;
    		return create_else_block_2$1;
    	}

    	let current_block_type = select_block_type_1(ctx, -1);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			if_block.c();
    			t0 = space();
    			div2 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			div1 = element("div");
    			t3 = text(t3_value);
    			t4 = space();
    			add_location(div0, file$i, 27, 20, 893);
    			attr_dev(div1, "class", "cost");
    			add_location(div1, file$i, 36, 24, 1321);
    			add_location(div2, file$i, 34, 20, 1239);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			if_block.m(div0, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, t1);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, t3);
    			append_dev(div2, t4);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			}

    			if (dirty & /*ship*/ 4 && t1_value !== (t1_value = /*part*/ ctx[11].attack.description() + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*ship*/ 4 && t3_value !== (t3_value = /*part*/ ctx[11].attack.cost() + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if_block.d();
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$2.name,
    		type: "if",
    		source: "(27:16) {#if part.weapon}",
    		ctx
    	});

    	return block;
    }

    // (31:24) {:else}
    function create_else_block_2$1(ctx) {
    	let button;
    	let t_value = /*part*/ ctx[11].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "lock");
    			add_location(button, file$i, 31, 28, 1120);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ship*/ 4 && t_value !== (t_value = /*part*/ ctx[11].name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2$1.name,
    		type: "else",
    		source: "(31:24) {:else}",
    		ctx
    	});

    	return block;
    }

    // (29:24) {#if part.attack.need(ship)}
    function create_if_block_5(ctx) {
    	let button;
    	let t_value = /*part*/ ctx[11].name + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[3](/*part*/ ctx[11]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			add_location(button, file$i, 29, 28, 980);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*ship*/ 4 && t_value !== (t_value = /*part*/ ctx[11].name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(29:24) {#if part.attack.need(ship)}",
    		ctx
    	});

    	return block;
    }

    // (26:12) {#each ship.parts as part}
    function create_each_block$8(ctx) {
    	let if_block_anchor;
    	let if_block = /*part*/ ctx[11].weapon && create_if_block_4$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*part*/ ctx[11].weapon) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_4$2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$8.name,
    		type: "each",
    		source: "(26:12) {#each ship.parts as part}",
    		ctx
    	});

    	return block;
    }

    // (46:16) {:else}
    function create_else_block_1$3(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Esquive";
    			attr_dev(button, "class", "lock");
    			add_location(button, file$i, 46, 20, 1708);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$3.name,
    		type: "else",
    		source: "(46:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (44:16) {#if !System.game.ship.dodge && System.game.ship.fuel >= 5}
    function create_if_block_3$6(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Esquive";
    			add_location(button, file$i, 44, 20, 1577);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[4], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$6.name,
    		type: "if",
    		source: "(44:16) {#if !System.game.ship.dodge && System.game.ship.fuel >= 5}",
    		ctx
    	});

    	return block;
    }

    // (65:16) {:else}
    function create_else_block$6(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Fuir";
    			attr_dev(button, "class", "lock");
    			add_location(button, file$i, 65, 20, 2425);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(65:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (63:16) {#if System.game.ship.fuel >= System.game.ship.getPart("Moteurs").move()}
    function create_if_block_2$6(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Fuir";
    			add_location(button, file$i, 63, 20, 2315);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_3*/ ctx[6], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$6.name,
    		type: "if",
    		source: "(63:16) {#if System.game.ship.fuel >= System.game.ship.getPart(\\\"Moteurs\\\").move()}",
    		ctx
    	});

    	return block;
    }

    // (104:4) {#if ship.shield_max() > 0}
    function create_if_block$9(ctx) {
    	let switch_instance;
    	let t;
    	let br;
    	let current;
    	var switch_value = Bar;

    	function switch_props(ctx) {
    		return {
    			props: {
    				name: "Bouclier",
    				value: /*ship*/ ctx[2].shield,
    				max: /*ship*/ ctx[2].shield_max(),
    				color: "blue"
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			t = space();
    			br = element("br");
    			add_location(br, file$i, 105, 8, 3843);
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, br, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*ship*/ 4) switch_instance_changes.value = /*ship*/ ctx[2].shield;
    			if (dirty & /*ship*/ 4) switch_instance_changes.max = /*ship*/ ctx[2].shield_max();

    			if (switch_value !== (switch_value = Bar)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, t.parentNode, t);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (switch_instance) destroy_component(switch_instance, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(br);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(104:4) {#if ship.shield_max() > 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let div1;
    	let center0;
    	let t0_value = /*ennemy*/ ctx[1].name + "";
    	let t0;
    	let t1;
    	let switch_instance0;
    	let t2;
    	let br0;
    	let t3;
    	let show_if_2 = /*ennemy*/ ctx[1].shield_max() > 0;
    	let t4;
    	let switch_instance1;
    	let t5;
    	let br1;
    	let br2;
    	let br3;
    	let t6;
    	let show_if_1;
    	let t7;
    	let br4;
    	let br5;
    	let t8;
    	let center1;
    	let t9_value = /*ship*/ ctx[2].name + "";
    	let t9;
    	let t10;
    	let switch_instance2;
    	let t11;
    	let br6;
    	let t12;
    	let show_if = /*ship*/ ctx[2].shield_max() > 0;
    	let t13;
    	let switch_instance3;
    	let t14;
    	let div0;
    	let t15_value = /*ship*/ ctx[2].fuel + "";
    	let t15;
    	let t16;
    	let current;
    	var switch_value = Bar;

    	function switch_props(ctx) {
    		return {
    			props: {
    				name: "Vie",
    				value: /*ennemy*/ ctx[1].life,
    				max: /*ennemy*/ ctx[1].life_max(),
    				color: "green"
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance0 = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	let if_block0 = show_if_2 && create_if_block_10(ctx);
    	var switch_value_1 = Bar;

    	function switch_props_1(ctx) {
    		return {
    			props: {
    				name: "Énergie",
    				value: /*ennemy*/ ctx[1].energy,
    				max: /*ennemy*/ ctx[1].energy_max(),
    				color: "yellow"
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value_1) {
    		switch_instance1 = construct_svelte_component_dev(switch_value_1, switch_props_1(ctx));
    	}

    	function select_block_type(ctx, dirty) {
    		if (dirty & /*System*/ 1) show_if_1 = null;
    		if (/*System*/ ctx[0].game.battle.phase == "select") return create_if_block_1$7;
    		if (show_if_1 == null) show_if_1 = !!["start", "result", "ennemy"].includes(/*System*/ ctx[0].game.battle.phase);
    		if (show_if_1) return create_if_block_6;
    		if (/*System*/ ctx[0].game.battle.phase == "victory") return create_if_block_7;
    		if (/*System*/ ctx[0].game.battle.phase == "defeat") return create_if_block_8;
    		if (/*System*/ ctx[0].game.battle.phase == "run") return create_if_block_9;
    	}

    	let current_block_type = select_block_type(ctx, -1);
    	let if_block1 = current_block_type && current_block_type(ctx);
    	var switch_value_2 = Bar;

    	function switch_props_2(ctx) {
    		return {
    			props: {
    				name: "Énergie",
    				value: /*ship*/ ctx[2].energy,
    				max: /*ship*/ ctx[2].energy_max(),
    				color: "yellow"
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value_2) {
    		switch_instance2 = construct_svelte_component_dev(switch_value_2, switch_props_2(ctx));
    	}

    	let if_block2 = show_if && create_if_block$9(ctx);
    	var switch_value_3 = Bar;

    	function switch_props_3(ctx) {
    		return {
    			props: {
    				name: "Vie",
    				value: /*ship*/ ctx[2].life,
    				max: /*ship*/ ctx[2].life_max(),
    				color: "green"
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value_3) {
    		switch_instance3 = construct_svelte_component_dev(switch_value_3, switch_props_3(ctx));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			center0 = element("center");
    			t0 = text(t0_value);
    			t1 = space();
    			if (switch_instance0) create_component(switch_instance0.$$.fragment);
    			t2 = space();
    			br0 = element("br");
    			t3 = space();
    			if (if_block0) if_block0.c();
    			t4 = space();
    			if (switch_instance1) create_component(switch_instance1.$$.fragment);
    			t5 = space();
    			br1 = element("br");
    			br2 = element("br");
    			br3 = element("br");
    			t6 = space();
    			if (if_block1) if_block1.c();
    			t7 = space();
    			br4 = element("br");
    			br5 = element("br");
    			t8 = space();
    			center1 = element("center");
    			t9 = text(t9_value);
    			t10 = space();
    			if (switch_instance2) create_component(switch_instance2.$$.fragment);
    			t11 = space();
    			br6 = element("br");
    			t12 = space();
    			if (if_block2) if_block2.c();
    			t13 = space();
    			if (switch_instance3) create_component(switch_instance3.$$.fragment);
    			t14 = space();
    			div0 = element("div");
    			t15 = text(t15_value);
    			t16 = text(" Carburant");
    			add_location(center0, file$i, 10, 4, 201);
    			add_location(br0, file$i, 12, 4, 344);
    			add_location(br1, file$i, 18, 4, 649);
    			add_location(br2, file$i, 18, 9, 654);
    			add_location(br3, file$i, 18, 14, 659);
    			add_location(br4, file$i, 99, 4, 3520);
    			add_location(br5, file$i, 99, 9, 3525);
    			add_location(center1, file$i, 100, 4, 3535);
    			add_location(br6, file$i, 102, 4, 3681);
    			set_style(div0, "text-align", "right");
    			add_location(div0, file$i, 108, 4, 3967);
    			set_style(div1, "width", "50vw");
    			add_location(div1, file$i, 9, 0, 171);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, center0);
    			append_dev(center0, t0);
    			append_dev(div1, t1);
    			if (switch_instance0) mount_component(switch_instance0, div1, null);
    			append_dev(div1, t2);
    			append_dev(div1, br0);
    			append_dev(div1, t3);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t4);
    			if (switch_instance1) mount_component(switch_instance1, div1, null);
    			append_dev(div1, t5);
    			append_dev(div1, br1);
    			append_dev(div1, br2);
    			append_dev(div1, br3);
    			append_dev(div1, t6);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t7);
    			append_dev(div1, br4);
    			append_dev(div1, br5);
    			append_dev(div1, t8);
    			append_dev(div1, center1);
    			append_dev(center1, t9);
    			append_dev(div1, t10);
    			if (switch_instance2) mount_component(switch_instance2, div1, null);
    			append_dev(div1, t11);
    			append_dev(div1, br6);
    			append_dev(div1, t12);
    			if (if_block2) if_block2.m(div1, null);
    			append_dev(div1, t13);
    			if (switch_instance3) mount_component(switch_instance3, div1, null);
    			append_dev(div1, t14);
    			append_dev(div1, div0);
    			append_dev(div0, t15);
    			append_dev(div0, t16);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*ennemy*/ 2) && t0_value !== (t0_value = /*ennemy*/ ctx[1].name + "")) set_data_dev(t0, t0_value);
    			const switch_instance0_changes = {};
    			if (dirty & /*ennemy*/ 2) switch_instance0_changes.value = /*ennemy*/ ctx[1].life;
    			if (dirty & /*ennemy*/ 2) switch_instance0_changes.max = /*ennemy*/ ctx[1].life_max();

    			if (switch_value !== (switch_value = Bar)) {
    				if (switch_instance0) {
    					group_outros();
    					const old_component = switch_instance0;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance0 = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					create_component(switch_instance0.$$.fragment);
    					transition_in(switch_instance0.$$.fragment, 1);
    					mount_component(switch_instance0, div1, t2);
    				} else {
    					switch_instance0 = null;
    				}
    			} else if (switch_value) {
    				switch_instance0.$set(switch_instance0_changes);
    			}

    			if (dirty & /*ennemy*/ 2) show_if_2 = /*ennemy*/ ctx[1].shield_max() > 0;

    			if (show_if_2) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*ennemy*/ 2) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_10(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div1, t4);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			const switch_instance1_changes = {};
    			if (dirty & /*ennemy*/ 2) switch_instance1_changes.value = /*ennemy*/ ctx[1].energy;
    			if (dirty & /*ennemy*/ 2) switch_instance1_changes.max = /*ennemy*/ ctx[1].energy_max();

    			if (switch_value_1 !== (switch_value_1 = Bar)) {
    				if (switch_instance1) {
    					group_outros();
    					const old_component = switch_instance1;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value_1) {
    					switch_instance1 = construct_svelte_component_dev(switch_value_1, switch_props_1(ctx));
    					create_component(switch_instance1.$$.fragment);
    					transition_in(switch_instance1.$$.fragment, 1);
    					mount_component(switch_instance1, div1, t5);
    				} else {
    					switch_instance1 = null;
    				}
    			} else if (switch_value_1) {
    				switch_instance1.$set(switch_instance1_changes);
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx, dirty)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if (if_block1) if_block1.d(1);
    				if_block1 = current_block_type && current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div1, t7);
    				}
    			}

    			if ((!current || dirty & /*ship*/ 4) && t9_value !== (t9_value = /*ship*/ ctx[2].name + "")) set_data_dev(t9, t9_value);
    			const switch_instance2_changes = {};
    			if (dirty & /*ship*/ 4) switch_instance2_changes.value = /*ship*/ ctx[2].energy;
    			if (dirty & /*ship*/ 4) switch_instance2_changes.max = /*ship*/ ctx[2].energy_max();

    			if (switch_value_2 !== (switch_value_2 = Bar)) {
    				if (switch_instance2) {
    					group_outros();
    					const old_component = switch_instance2;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value_2) {
    					switch_instance2 = construct_svelte_component_dev(switch_value_2, switch_props_2(ctx));
    					create_component(switch_instance2.$$.fragment);
    					transition_in(switch_instance2.$$.fragment, 1);
    					mount_component(switch_instance2, div1, t11);
    				} else {
    					switch_instance2 = null;
    				}
    			} else if (switch_value_2) {
    				switch_instance2.$set(switch_instance2_changes);
    			}

    			if (dirty & /*ship*/ 4) show_if = /*ship*/ ctx[2].shield_max() > 0;

    			if (show_if) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*ship*/ 4) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$9(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div1, t13);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			const switch_instance3_changes = {};
    			if (dirty & /*ship*/ 4) switch_instance3_changes.value = /*ship*/ ctx[2].life;
    			if (dirty & /*ship*/ 4) switch_instance3_changes.max = /*ship*/ ctx[2].life_max();

    			if (switch_value_3 !== (switch_value_3 = Bar)) {
    				if (switch_instance3) {
    					group_outros();
    					const old_component = switch_instance3;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value_3) {
    					switch_instance3 = construct_svelte_component_dev(switch_value_3, switch_props_3(ctx));
    					create_component(switch_instance3.$$.fragment);
    					transition_in(switch_instance3.$$.fragment, 1);
    					mount_component(switch_instance3, div1, t14);
    				} else {
    					switch_instance3 = null;
    				}
    			} else if (switch_value_3) {
    				switch_instance3.$set(switch_instance3_changes);
    			}

    			if ((!current || dirty & /*ship*/ 4) && t15_value !== (t15_value = /*ship*/ ctx[2].fuel + "")) set_data_dev(t15, t15_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance0) transition_in(switch_instance0.$$.fragment, local);
    			transition_in(if_block0);
    			if (switch_instance1) transition_in(switch_instance1.$$.fragment, local);
    			if (switch_instance2) transition_in(switch_instance2.$$.fragment, local);
    			transition_in(if_block2);
    			if (switch_instance3) transition_in(switch_instance3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance0) transition_out(switch_instance0.$$.fragment, local);
    			transition_out(if_block0);
    			if (switch_instance1) transition_out(switch_instance1.$$.fragment, local);
    			if (switch_instance2) transition_out(switch_instance2.$$.fragment, local);
    			transition_out(if_block2);
    			if (switch_instance3) transition_out(switch_instance3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (switch_instance0) destroy_component(switch_instance0);
    			if (if_block0) if_block0.d();
    			if (switch_instance1) destroy_component(switch_instance1);

    			if (if_block1) {
    				if_block1.d();
    			}

    			if (switch_instance2) destroy_component(switch_instance2);
    			if (if_block2) if_block2.d();
    			if (switch_instance3) destroy_component(switch_instance3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let ship;
    	let ennemy;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Battle', slots, []);
    	let { System } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<Battle> was created without expected prop 'System'");
    		}
    	});

    	const writable_props = ['System'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Battle> was created with unknown prop '${key}'`);
    	});

    	const click_handler = part => {
    		System.game.battle.attack(part);
    	};

    	const click_handler_1 = () => {
    		System.game.battle.dodge(System.game.ship);
    	};

    	const click_handler_2 = () => {
    		System.game.battle.nextTurn();
    	};

    	const click_handler_3 = () => {
    		System.game.battle.run();
    	};

    	const click_handler_4 = () => {
    		System.game.battle.check();
    	};

    	const click_handler_5 = () => {
    		System.game.battle.finish();
    	};

    	const click_handler_6 = () => {
    		System.pages.change("GameOver");
    	};

    	const click_handler_7 = () => {
    		System.pages.change("Menu");
    	};

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({ Bar, System, ennemy, ship });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    		if ('ennemy' in $$props) $$invalidate(1, ennemy = $$props.ennemy);
    		if ('ship' in $$props) $$invalidate(2, ship = $$props.ship);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*System*/ 1) {
    			$$invalidate(2, ship = System.game.ship);
    		}

    		if ($$self.$$.dirty & /*System*/ 1) {
    			$$invalidate(1, ennemy = System.game.planet.event.ennemy);
    		}
    	};

    	return [
    		System,
    		ennemy,
    		ship,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7
    	];
    }

    let Battle$1 = class Battle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { System: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Battle",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get System() {
    		throw new Error("<Battle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Battle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    };

    /* src/Events/Vaisseau pirate/Interface.svelte generated by Svelte v3.59.2 */
    const file$h = "src/Events/Vaisseau pirate/Interface.svelte";

    // (30:53) 
    function create_if_block_3$5(ctx) {
    	let t0;
    	let br0;
    	let t1;
    	let div0;
    	let t2;
    	let t3_value = /*System*/ ctx[0].game.planet.event.fuel + "";
    	let t3;
    	let t4;
    	let t5;
    	let br1;
    	let t6;
    	let div1;
    	let t7;
    	let t8_value = /*System*/ ctx[0].game.planet.event.steel + "";
    	let t8;
    	let t9;
    	let t10;
    	let br2;
    	let t11;
    	let div2;
    	let t12;
    	let t13_value = /*System*/ ctx[0].game.planet.event.money + "";
    	let t13;
    	let t14;
    	let t15;
    	let br3;
    	let br4;
    	let t16;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			t0 = text("Le vaisseau pirate est détruit, vous récupérez ce qu'il transportait.\n    ");
    			br0 = element("br");
    			t1 = space();
    			div0 = element("div");
    			t2 = text("+ ");
    			t3 = text(t3_value);
    			t4 = text(" Carburant");
    			t5 = space();
    			br1 = element("br");
    			t6 = space();
    			div1 = element("div");
    			t7 = text("+ ");
    			t8 = text(t8_value);
    			t9 = text(" Acier");
    			t10 = space();
    			br2 = element("br");
    			t11 = space();
    			div2 = element("div");
    			t12 = text("+ ");
    			t13 = text(t13_value);
    			t14 = text(" $");
    			t15 = space();
    			br3 = element("br");
    			br4 = element("br");
    			t16 = space();
    			button = element("button");
    			button.textContent = "Ok";
    			add_location(br0, file$h, 31, 4, 1051);
    			attr_dev(div0, "class", "win");
    			add_location(div0, file$h, 32, 4, 1061);
    			add_location(br1, file$h, 33, 4, 1132);
    			attr_dev(div1, "class", "win");
    			add_location(div1, file$h, 34, 4, 1142);
    			add_location(br2, file$h, 35, 4, 1210);
    			attr_dev(div2, "class", "win");
    			add_location(div2, file$h, 36, 4, 1220);
    			add_location(br3, file$h, 37, 4, 1284);
    			add_location(br4, file$h, 37, 9, 1289);
    			add_location(button, file$h, 38, 4, 1299);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t2);
    			append_dev(div0, t3);
    			append_dev(div0, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t7);
    			append_dev(div1, t8);
    			append_dev(div1, t9);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, br2, anchor);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, t12);
    			append_dev(div2, t13);
    			append_dev(div2, t14);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, br3, anchor);
    			insert_dev(target, br4, anchor);
    			insert_dev(target, t16, anchor);
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_2*/ ctx[5], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*System*/ 1 && t3_value !== (t3_value = /*System*/ ctx[0].game.planet.event.fuel + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*System*/ 1 && t8_value !== (t8_value = /*System*/ ctx[0].game.planet.event.steel + "")) set_data_dev(t8, t8_value);
    			if (dirty & /*System*/ 1 && t13_value !== (t13_value = /*System*/ ctx[0].game.planet.event.money + "")) set_data_dev(t13, t13_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(br2);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(br3);
    			if (detaching) detach_dev(br4);
    			if (detaching) detach_dev(t16);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$5.name,
    		type: "if",
    		source: "(30:53) ",
    		ctx
    	});

    	return block;
    }

    // (28:52) 
    function create_if_block_2$5(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = Battle$1;

    	function switch_props(ctx) {
    		return {
    			props: { System: /*System*/ ctx[0] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*System*/ 1) switch_instance_changes.System = /*System*/ ctx[0];

    			if (switch_value !== (switch_value = Battle$1)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$5.name,
    		type: "if",
    		source: "(28:52) ",
    		ctx
    	});

    	return block;
    }

    // (17:0) {#if System.game.planet.event.step == "select"}
    function create_if_block$8(ctx) {
    	let t0;
    	let br0;
    	let br1;
    	let t1;
    	let button;
    	let t3;
    	let br2;
    	let t4;
    	let show_if;
    	let t5;
    	let div;
    	let t6;
    	let t7_value = /*System*/ ctx[0].game.ship.getPart("Moteurs").move() + "";
    	let t7;
    	let t8;
    	let mounted;
    	let dispose;

    	function select_block_type_1(ctx, dirty) {
    		if (dirty & /*System*/ 1) show_if = null;
    		if (show_if == null) show_if = !!(/*System*/ ctx[0].game.ship.fuel >= /*System*/ ctx[0].game.ship.getPart("Moteurs").move());
    		if (show_if) return create_if_block_1$6;
    		return create_else_block$5;
    	}

    	let current_block_type = select_block_type_1(ctx, -1);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			t0 = text("Un vaisseau pirate vous attaque !\n    ");
    			br0 = element("br");
    			br1 = element("br");
    			t1 = space();
    			button = element("button");
    			button.textContent = "L'affronter";
    			t3 = space();
    			br2 = element("br");
    			t4 = space();
    			if_block.c();
    			t5 = space();
    			div = element("div");
    			t6 = text("-");
    			t7 = text(t7_value);
    			t8 = text(" Carburant");
    			add_location(br0, file$h, 18, 4, 458);
    			add_location(br1, file$h, 18, 9, 463);
    			add_location(button, file$h, 19, 4, 473);
    			add_location(br2, file$h, 20, 4, 534);
    			attr_dev(div, "class", "cost");
    			add_location(div, file$h, 26, 4, 738);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, br2, anchor);
    			insert_dev(target, t4, anchor);
    			if_block.m(target, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, t6);
    			append_dev(div, t7);
    			append_dev(div, t8);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[3], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(t5.parentNode, t5);
    				}
    			}

    			if (dirty & /*System*/ 1 && t7_value !== (t7_value = /*System*/ ctx[0].game.ship.getPart("Moteurs").move() + "")) set_data_dev(t7, t7_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(br2);
    			if (detaching) detach_dev(t4);
    			if_block.d(detaching);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(17:0) {#if System.game.planet.event.step == \\\"select\\\"}",
    		ctx
    	});

    	return block;
    }

    // (24:4) {:else}
    function create_else_block$5(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Fuir";
    			attr_dev(button, "class", "lock");
    			add_location(button, file$h, 24, 4, 689);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(24:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (22:4) {#if System.game.ship.fuel >= System.game.ship.getPart("Moteurs").move()}
    function create_if_block_1$6(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Fuir";
    			add_location(button, file$h, 22, 8, 626);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[4], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(22:4) {#if System.game.ship.fuel >= System.game.ship.getPart(\\\"Moteurs\\\").move()}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$8, create_if_block_2$5, create_if_block_3$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*System*/ ctx[0].game.planet.event.step == "select") return 0;
    		if (/*System*/ ctx[0].game.planet.event.step == "battle") return 1;
    		if (/*System*/ ctx[0].game.planet.event.step == "victory") return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Interface', slots, []);
    	let { System } = $$props;

    	function battle() {
    		$$invalidate(0, System.game.planet.event.step = "battle", System);
    		System.game.battle.start(System);
    	}

    	function run() {
    		$$invalidate(0, System.game.ship.fuel -= System.game.ship.getPart("Moteurs").move(), System);
    		System.pages.change("Menu");
    	}

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<Interface> was created without expected prop 'System'");
    		}
    	});

    	const writable_props = ['System'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Interface> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		battle();
    	};

    	const click_handler_1 = () => {
    		run();
    	};

    	const click_handler_2 = () => {
    		System.pages.change("Menu");
    	};

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({ Battle: Battle$1, System, battle, run });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [System, battle, run, click_handler, click_handler_1, click_handler_2];
    }

    let Interface$1 = class Interface extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { System: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Interface",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get System() {
    		throw new Error("<Interface>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Interface>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    };

    class VaisseauPirate {
        name = "Vaisseau pirate";
        svelte = Interface$1;
        ennemy;
        fuel = 0;
        steel = 0;
        money = 0;
        win = function (System) {
            System.game.ship.fuel += this.fuel;
            System.game.steel += this.steel;
            System.game.money += this.money;
        }
        step = "select";

        constructor (System, level) {
            this.ennemy = new Ship$2(System.game, "Vaisseau Pirate");
            this.ennemy.addPart(System, System.parts.getByName("Coque", level));
            if (level > 3) {
                this.ennemy.addPart(System, System.parts.getByName("Générateur", level));
            }
            else {
                this.ennemy.addPart(System, System.parts.getByName("Générateur", 3));
            }
            this.ennemy.addPart(System, System.parts.getByName("Cannon léger", level));
            this.fuel = 2;
            this.steel = 5 + 5*level;
            this.money = 5 + 5*level;
        }
    }

    /* src/Events/Vaisseau mere/Interface.svelte generated by Svelte v3.59.2 */
    const file$g = "src/Events/Vaisseau mere/Interface.svelte";

    // (18:53) 
    function create_if_block_2$4(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*System*/ ctx[0].game.sector.slot == /*System*/ ctx[0].game.map.length - 1) return create_if_block_3$4;
    		return create_else_block$4;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(18:53) ",
    		ctx
    	});

    	return block;
    }

    // (16:52) 
    function create_if_block_1$5(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = Battle$1;

    	function switch_props(ctx) {
    		return {
    			props: { System: /*System*/ ctx[0] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*System*/ 1) switch_instance_changes.System = /*System*/ ctx[0];

    			if (switch_value !== (switch_value = Battle$1)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(16:52) ",
    		ctx
    	});

    	return block;
    }

    // (12:0) {#if System.game.planet.event.step == "select"}
    function create_if_block$7(ctx) {
    	let t0;
    	let br0;
    	let br1;
    	let t1;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			t0 = text("Le vaisseau mère sort de la base ennemie, l'affrontement va commencer.\n    ");
    			br0 = element("br");
    			br1 = element("br");
    			t1 = space();
    			button = element("button");
    			button.textContent = "L'affronter";
    			add_location(br0, file$g, 13, 4, 353);
    			add_location(br1, file$g, 13, 9, 358);
    			add_location(button, file$g, 14, 4, 368);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(12:0) {#if System.game.planet.event.step == \\\"select\\\"}",
    		ctx
    	});

    	return block;
    }

    // (29:4) {:else}
    function create_else_block$4(ctx) {
    	let t0;
    	let br0;
    	let br1;
    	let t1;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			t0 = text("Le vaisseau mère du dernier secteur est détruit. Votre voyage est terminé, vous avez rempli votre mission.\n        ");
    			br0 = element("br");
    			br1 = element("br");
    			t1 = space();
    			button = element("button");
    			button.textContent = "Ok";
    			add_location(br0, file$g, 30, 8, 1256);
    			add_location(br1, file$g, 30, 13, 1261);
    			add_location(button, file$g, 31, 8, 1275);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_2*/ ctx[4], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(29:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (19:4) {#if System.game.sector.slot == System.game.map.length - 1}
    function create_if_block_3$4(ctx) {
    	let t0;
    	let br0;
    	let t1;
    	let div0;
    	let t2;
    	let t3_value = /*System*/ ctx[0].game.planet.event.fuel + "";
    	let t3;
    	let t4;
    	let t5;
    	let br1;
    	let t6;
    	let div1;
    	let t7;
    	let t8_value = /*System*/ ctx[0].game.planet.event.steel + "";
    	let t8;
    	let t9;
    	let t10;
    	let br2;
    	let t11;
    	let div2;
    	let t12;
    	let t13_value = /*System*/ ctx[0].game.planet.event.money + "";
    	let t13;
    	let t14;
    	let t15;
    	let br3;
    	let br4;
    	let t16;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			t0 = text("Le vaisseau mère est détruit, vous récupérez ce qu'il transportait. Vous pouvez désormais accéder au secteur suivant.\n        ");
    			br0 = element("br");
    			t1 = space();
    			div0 = element("div");
    			t2 = text("+ ");
    			t3 = text(t3_value);
    			t4 = text(" Carburant");
    			t5 = space();
    			br1 = element("br");
    			t6 = space();
    			div1 = element("div");
    			t7 = text("+ ");
    			t8 = text(t8_value);
    			t9 = text(" Acier");
    			t10 = space();
    			br2 = element("br");
    			t11 = space();
    			div2 = element("div");
    			t12 = text("+ ");
    			t13 = text(t13_value);
    			t14 = text(" $");
    			t15 = space();
    			br3 = element("br");
    			br4 = element("br");
    			t16 = space();
    			button = element("button");
    			button.textContent = "Ok";
    			add_location(br0, file$g, 20, 8, 778);
    			attr_dev(div0, "class", "win");
    			add_location(div0, file$g, 21, 8, 792);
    			add_location(br1, file$g, 22, 8, 867);
    			attr_dev(div1, "class", "win");
    			add_location(div1, file$g, 23, 8, 881);
    			add_location(br2, file$g, 24, 8, 953);
    			attr_dev(div2, "class", "win");
    			add_location(div2, file$g, 25, 8, 967);
    			add_location(br3, file$g, 26, 8, 1035);
    			add_location(br4, file$g, 26, 13, 1040);
    			add_location(button, file$g, 27, 8, 1054);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t2);
    			append_dev(div0, t3);
    			append_dev(div0, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t7);
    			append_dev(div1, t8);
    			append_dev(div1, t9);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, br2, anchor);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, t12);
    			append_dev(div2, t13);
    			append_dev(div2, t14);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, br3, anchor);
    			insert_dev(target, br4, anchor);
    			insert_dev(target, t16, anchor);
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[3], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*System*/ 1 && t3_value !== (t3_value = /*System*/ ctx[0].game.planet.event.fuel + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*System*/ 1 && t8_value !== (t8_value = /*System*/ ctx[0].game.planet.event.steel + "")) set_data_dev(t8, t8_value);
    			if (dirty & /*System*/ 1 && t13_value !== (t13_value = /*System*/ ctx[0].game.planet.event.money + "")) set_data_dev(t13, t13_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(br2);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(br3);
    			if (detaching) detach_dev(br4);
    			if (detaching) detach_dev(t16);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$4.name,
    		type: "if",
    		source: "(19:4) {#if System.game.sector.slot == System.game.map.length - 1}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$7, create_if_block_1$5, create_if_block_2$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*System*/ ctx[0].game.planet.event.step == "select") return 0;
    		if (/*System*/ ctx[0].game.planet.event.step == "battle") return 1;
    		if (/*System*/ ctx[0].game.planet.event.step == "victory") return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Interface', slots, []);
    	let { System } = $$props;

    	function battle() {
    		$$invalidate(0, System.game.planet.event.step = "battle", System);
    		System.game.battle.start(System);
    	}

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<Interface> was created without expected prop 'System'");
    		}
    	});

    	const writable_props = ['System'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Interface> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		battle();
    	};

    	const click_handler_1 = () => {
    		System.pages.change("Menu");
    	};

    	const click_handler_2 = () => {
    		System.pages.change("Menu");
    	};

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({ Battle: Battle$1, System, battle });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [System, battle, click_handler, click_handler_1, click_handler_2];
    }

    class Interface extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { System: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Interface",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get System() {
    		throw new Error("<Interface>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Interface>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    class VaisseauMere {
        name = "Vaisseau mère";
        svelte = Interface;
        ennemy;
        fuel = 0;
        steel = 0;
        money = 0;
        win = function (System) {
            System.game.ship.fuel += this.fuel;
            System.game.steel += this.steel;
            System.game.money += this.money;
        }
        step = "select";

        constructor (System, level) {
            this.ennemy = new Ship$2(System.game, "Vaisseau Mère");
            this.ennemy.addPart(System, System.parts.getByName("Coque", level*2));
            this.ennemy.addPart(System, System.parts.getByName("Générateur", 6));
            this.ennemy.addPart(System, System.parts.getByName("Cannon léger", level));
            this.fuel = 10;
            this.steel = 10 + 10*level;
            this.money = 10 + 10*level;
        }
    }

    var events = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Collision: Collision,
        Fouille: Fouille,
        Marchand: Marchand,
        Rien: Rien,
        VaisseauMere: VaisseauMere,
        VaisseauPirate: VaisseauPirate
    });

    /* src/TitleScreen.svelte generated by Svelte v3.59.2 */

    const { console: console_1 } = globals;
    const file$f = "src/TitleScreen.svelte";

    function create_fragment$g(ctx) {
    	let div;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			button.textContent = "Jouer";
    			add_location(button, file$f, 9, 4, 205);
    			attr_dev(div, "class", "center");
    			add_location(div, file$f, 8, 0, 180);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[1], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TitleScreen', slots, []);
    	let { System } = $$props;
    	console.log(System.events.instance.length + " évenements");
    	console.log(System.parts.instance.length + " modules");

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console_1.warn("<TitleScreen> was created without expected prop 'System'");
    		}
    	});

    	const writable_props = ['System'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<TitleScreen> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => System.pages.change("SelectStarter");

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({ System });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [System, click_handler];
    }

    class TitleScreen extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { System: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TitleScreen",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get System() {
    		throw new Error("<TitleScreen>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<TitleScreen>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    class Battle {
        phase = "";
        step = 0;
        stop = false;
        action_result = "";

        constructor(game) {
            this.game = game;
        };

        next = function (phase) {
            this.phase = phase;
            this.game.System.pages.change("Event");
        };

        check = function () {
            if (this.game.ship.life <= 0) {
                this.phase = "defeat";
                this.game.System.pages.change("Event");
            }
            else if (this.game.planet.event.ennemy.life <= 0) {
                this.phase = "victory";
                this.game.System.pages.change("Event");
            }
            else {
                if (this.phase == "start") {
                    this.startTurn();
                }
                else if (this.phase == "result") {
                    this.next("select");
                }
                else if (this.phase == "ennemy") {
                    this.ennemyTurn();
                }
            }
        };

        start = function () {
            this.step = 0;
            this.game.ship.energy = this.game.ship.energy_max();
            this.game.planet.event.ennemy.energy = this.game.planet.event.ennemy.energy_max();
            this.startTurn();
        };

        startTurn = function () {
            this.game.ship.dodge = false;
            if (this.step < 1) {
                this.step = 1;
                if (this.game.ship.checkPart("Drone de combat")) {
                    console.log("test");
                    this.action_result = this.game.ship.getPart("Drone de combat").action(this.game.ship, this.game.planet.event.ennemy);
                    this.next("start");
                    return 0;
                }
            }
            if (this.step < 2) {
                this.step = 2;
                if (this.game.ship.checkPart("Drone de réparation")) {
                    this.action_result = this.game.ship.getPart("Drone de réparation").action(this.game.ship);
                    this.next("start");
                    return 0;
                }
            }
            this.step = 0;
            this.next("select");
        };

        attack = function (weapon) {
            this.action_result = weapon.attack.use(this.game.ship, this.game.planet.event.ennemy);
            this.next("result");
        };

        dodge = function (ship) {
            ship.dodge = true;
            ship.fuel -= 5;
            this.action_result = ship.name + " effectue une manoeuvre d'esquive.";
            ship.useSkill("Pilotage", 20);
            this.next("result");
        };

        nextTurn = function () {
            this.game.ship.energy = this.game.ship.energy_max();
            this.stop = true;
            this.ennemyTurn();
        };

        run = function () {
            this.game.ship.fuel -= this.game.ship.getPart("Moteurs").move();
            if (Math.random() < 0.5) {
                this.action_result = this.game.ship.name + " tente de s'enfuir mais " + this.game.planet.event.ennemy.name + " le rattrape.";
                this.next("result");
            }
            else {
                this.next("run");
            }
        };

        ennemyTurn = function () {
            for (let i = this.step; i < this.game.planet.event.ennemy.parts.length; i++) {
                let part = this.game.planet.event.ennemy.parts[i];
                if (part.weapon) {
                    if (part.attack.need(this.game.planet.event.ennemy)) {
                        this.stop = false;
                        this.action_result = part.attack.use(this.game.planet.event.ennemy, this.game.ship);
                        this.next("ennemy");
                        return 0;
                    }
                }
            }
            if (!this.stop) {
                this.step = 0;
                this.stop = true;
                this.ennemyTurn();
            }
            else {
                this.game.planet.event.ennemy.energy = this.game.planet.event.ennemy.energy_max();
                this.startTurn();
            }
        };

        finish = function () {
            this.game.planet.event.step = "victory";
            this.game.planet.event.win(this.game.System);
            this.game.System.pages.change("Event");
        };
    }

    class Game {
        System;
        money = 100;
        steel = 0;
        characters = [];
        map = [];
        sector = {};
        battle = new Battle(this);

        constructor(System) {
            this.System = System;
            for (let i = 0; i < 6; i++) {
                let stage = [];
                let sectorNumber = 1;
                if (i > 0 && i < 5) {
                    sectorNumber = 1 + parseInt(Math.random() * 2);
                }
                for (let j = 0; j < sectorNumber; j++) {
                    stage.push(System.sectors.getByName("Secteur Humain", i));
                }
                this.map.push(stage);
            }
            this.sector = this.map[0][0];
            this.sector.info = true;
            this.sector.visited = true;
        }

        jump = function (planet) {
            this.planet = planet;
            planet.info = true;
            planet.visited = true;
            if (this.ship.shield_max() > 0) {
                this.ship.shield = this.ship.shield_max();
            }
            if (this.ship.checkPart("Scanner")) {
                this.ship.getPart("Scanner").scan(this.System);
            }
            if (this.ship.checkPart("Catalyseur")) {
                this.ship.getPart("Catalyseur").giveFuel(this.System);
            }
            if (this.ship.checkPart("Extracteur")) {
                this.ship.getPart("Extracteur").giveSteel(this.System);
            }
            if (this.ship.checkPart("Maintenance")) {
                this.ship.getPart("Maintenance").heal(this.System);
            }
            if (planet.step == this.sector.steps.length - 1 && this.sector.slot < this.map.length - 1) {
                let nextSectors = this.map[this.sector.slot + 1];
                for (let i = 0; i < nextSectors.length; i++) {
                    nextSectors[i].info = true;
                }
            }
        }
    }

    /* src/SelectStarter.svelte generated by Svelte v3.59.2 */
    const file$e = "src/SelectStarter.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	child_ctx[18] = i;
    	return child_ctx;
    }

    // (25:8) {#each System.starters.instance as s, i}
    function create_each_block_3(ctx) {
    	let button;
    	let t0_value = /*s*/ ctx[16].name + "";
    	let t0;
    	let t1;
    	let br;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[5](/*i*/ ctx[18]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			br = element("br");
    			add_location(button, file$e, 25, 12, 682);
    			add_location(br, file$e, 26, 12, 751);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, br, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_1, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*System*/ 1 && t0_value !== (t0_value = /*s*/ ctx[16].name + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(br);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(25:8) {#each System.starters.instance as s, i}",
    		ctx
    	});

    	return block;
    }

    // (31:8) {#if Starter != undefined}
    function create_if_block$6(ctx) {
    	let div0;
    	let t0_value = /*System*/ ctx[0].starters.instance[/*Starter*/ ctx[1]].name + "";
    	let t0;
    	let t1;
    	let br0;
    	let t2;
    	let u0;
    	let t4;
    	let br1;
    	let t5;
    	let t6;
    	let br2;
    	let t7;
    	let u1;
    	let t9;
    	let br3;
    	let t10;
    	let t11;
    	let br4;
    	let t12;
    	let div1;
    	let button;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*System*/ ctx[0].starters.instance[/*Starter*/ ctx[1]].ship.characters;
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	let each_value = /*System*/ ctx[0].starters.instance[/*Starter*/ ctx[1]].ship.parts;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			br0 = element("br");
    			t2 = space();
    			u0 = element("u");
    			u0.textContent = "Équipage :";
    			t4 = space();
    			br1 = element("br");
    			t5 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t6 = space();
    			br2 = element("br");
    			t7 = space();
    			u1 = element("u");
    			u1.textContent = "Modules :";
    			t9 = space();
    			br3 = element("br");
    			t10 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t11 = space();
    			br4 = element("br");
    			t12 = space();
    			div1 = element("div");
    			button = element("button");
    			button.textContent = "Jouer";
    			set_style(div0, "text-align", "center");
    			add_location(div0, file$e, 31, 12, 861);
    			add_location(br0, file$e, 34, 12, 982);
    			add_location(u0, file$e, 35, 12, 1000);
    			add_location(br1, file$e, 36, 12, 1030);
    			add_location(br2, file$e, 46, 12, 1425);
    			add_location(u1, file$e, 47, 12, 1443);
    			add_location(br3, file$e, 48, 12, 1472);
    			add_location(br4, file$e, 53, 12, 1649);
    			add_location(button, file$e, 55, 16, 1716);
    			set_style(div1, "text-align", "center");
    			add_location(div1, file$e, 54, 12, 1667);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, u0, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t5, anchor);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				if (each_blocks_1[i]) {
    					each_blocks_1[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, t6, anchor);
    			insert_dev(target, br2, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, u1, anchor);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, br3, anchor);
    			insert_dev(target, t10, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, t11, anchor);
    			insert_dev(target, br4, anchor);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_2*/ ctx[6], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*System, Starter*/ 3 && t0_value !== (t0_value = /*System*/ ctx[0].starters.instance[/*Starter*/ ctx[1]].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*System, Starter*/ 3) {
    				each_value_1 = /*System*/ ctx[0].starters.instance[/*Starter*/ ctx[1]].ship.characters;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(t6.parentNode, t6);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*System, Starter*/ 3) {
    				each_value = /*System*/ ctx[0].starters.instance[/*Starter*/ ctx[1]].ship.parts;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t11.parentNode, t11);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(u0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t5);
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(br2);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(u1);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(br3);
    			if (detaching) detach_dev(t10);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(br4);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(31:8) {#if Starter != undefined}",
    		ctx
    	});

    	return block;
    }

    // (41:20) {#each character.listSkill() as skill}
    function create_each_block_2(ctx) {
    	let t0_value = /*skill*/ ctx[13].name + "";
    	let t0;
    	let t1;
    	let t2_value = /*skill*/ ctx[13].level + "";
    	let t2;
    	let t3;
    	let br;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = text(" Lv ");
    			t2 = text(t2_value);
    			t3 = space();
    			br = element("br");
    			add_location(br, file$e, 42, 24, 1336);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, br, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*System, Starter*/ 3 && t0_value !== (t0_value = /*skill*/ ctx[13].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*System, Starter*/ 3 && t2_value !== (t2_value = /*skill*/ ctx[13].level + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(br);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(41:20) {#each character.listSkill() as skill}",
    		ctx
    	});

    	return block;
    }

    // (38:12) {#each System.starters.instance[Starter].ship.characters as character}
    function create_each_block_1$2(ctx) {
    	let t0_value = /*character*/ ctx[10].race + "";
    	let t0;
    	let t1;
    	let div;
    	let each_value_2 = /*character*/ ctx[10].listSkill();
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_style(div, "margin-left", "3vw");
    			add_location(div, file$e, 39, 16, 1168);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div, null);
    				}
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*System, Starter*/ 3 && t0_value !== (t0_value = /*character*/ ctx[10].race + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*System, Starter*/ 3) {
    				each_value_2 = /*character*/ ctx[10].listSkill();
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(38:12) {#each System.starters.instance[Starter].ship.characters as character}",
    		ctx
    	});

    	return block;
    }

    // (50:12) {#each System.starters.instance[Starter].ship.parts as part}
    function create_each_block$7(ctx) {
    	let t0_value = /*part*/ ctx[7].name + "";
    	let t0;
    	let t1;
    	let t2_value = /*part*/ ctx[7].level + "";
    	let t2;
    	let t3;
    	let br;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = text(" Lv ");
    			t2 = text(t2_value);
    			t3 = space();
    			br = element("br");
    			add_location(br, file$e, 51, 16, 1611);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, br, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*System, Starter*/ 3 && t0_value !== (t0_value = /*part*/ ctx[7].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*System, Starter*/ 3 && t2_value !== (t2_value = /*part*/ ctx[7].level + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(br);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(50:12) {#each System.starters.instance[Starter].ship.parts as part}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let div2;
    	let div0;
    	let button;
    	let t1;
    	let br0;
    	let br1;
    	let t2;
    	let t3;
    	let div1;
    	let mounted;
    	let dispose;
    	let each_value_3 = /*System*/ ctx[0].starters.instance;
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	let if_block = /*Starter*/ ctx[1] != undefined && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			button = element("button");
    			button.textContent = "Retour";
    			t1 = space();
    			br0 = element("br");
    			br1 = element("br");
    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t3 = space();
    			div1 = element("div");
    			if (if_block) if_block.c();
    			add_location(button, file$e, 22, 8, 526);
    			add_location(br0, file$e, 23, 8, 610);
    			add_location(br1, file$e, 23, 13, 615);
    			add_location(div0, file$e, 21, 4, 512);
    			attr_dev(div1, "class", "description svelte-13czh88");
    			add_location(div1, file$e, 29, 4, 788);
    			attr_dev(div2, "class", "container svelte-13czh88");
    			add_location(div2, file$e, 20, 0, 484);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, button);
    			append_dev(div0, t1);
    			append_dev(div0, br0);
    			append_dev(div0, br1);
    			append_dev(div0, t2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div0, null);
    				}
    			}

    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			if (if_block) if_block.m(div1, null);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[4], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*selectShip, System*/ 5) {
    				each_value_3 = /*System*/ ctx[0].starters.instance;
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_3.length;
    			}

    			if (/*Starter*/ ctx[1] != undefined) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SelectStarter', slots, []);
    	let { System } = $$props;
    	let Starter = undefined;

    	function selectShip(starter) {
    		$$invalidate(1, Starter = starter);
    	}

    	function newGame() {
    		$$invalidate(0, System.game = new Game(System), System);
    		let starter = new System.starters.class[Starter](System);
    		$$invalidate(0, System.game.ship = starter.ship, System);
    		System.game.jump(System.game.sector.steps[0][0]);
    		System.pages.change("Menu");
    	}

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<SelectStarter> was created without expected prop 'System'");
    		}
    	});

    	const writable_props = ['System'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SelectStarter> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => System.pages.change("TitleScreen");
    	const click_handler_1 = i => selectShip(i);
    	const click_handler_2 = () => newGame();

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({
    		GameClass: Game,
    		System,
    		Starter,
    		selectShip,
    		newGame
    	});

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    		if ('Starter' in $$props) $$invalidate(1, Starter = $$props.Starter);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		System,
    		Starter,
    		selectShip,
    		newGame,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class SelectStarter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { System: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SelectStarter",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get System() {
    		throw new Error("<SelectStarter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<SelectStarter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Menu/LifeBar.svelte generated by Svelte v3.59.2 */

    // (8:0) {#if System.game.ship.shield_max() > 0}
    function create_if_block$5(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = Bar;

    	function switch_props(ctx) {
    		return {
    			props: {
    				name: "Bouclier",
    				value: /*System*/ ctx[0].game.ship.shield,
    				max: /*System*/ ctx[0].game.ship.shield_max(),
    				color: "blue"
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*System*/ 1) switch_instance_changes.value = /*System*/ ctx[0].game.ship.shield;
    			if (dirty & /*System*/ 1) switch_instance_changes.max = /*System*/ ctx[0].game.ship.shield_max();

    			if (switch_value !== (switch_value = Bar)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(8:0) {#if System.game.ship.shield_max() > 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let switch_instance;
    	let t;
    	let show_if = /*System*/ ctx[0].game.ship.shield_max() > 0;
    	let if_block_anchor;
    	let current;
    	var switch_value = Bar;

    	function switch_props(ctx) {
    		return {
    			props: {
    				name: "Vie",
    				value: /*System*/ ctx[0].game.ship.life,
    				max: /*System*/ ctx[0].game.ship.life_max(),
    				color: "green"
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	let if_block = show_if && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = {};
    			if (dirty & /*System*/ 1) switch_instance_changes.value = /*System*/ ctx[0].game.ship.life;
    			if (dirty & /*System*/ 1) switch_instance_changes.max = /*System*/ ctx[0].game.ship.life_max();

    			if (switch_value !== (switch_value = Bar)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, t.parentNode, t);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}

    			if (dirty & /*System*/ 1) show_if = /*System*/ ctx[0].game.ship.shield_max() > 0;

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*System*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (switch_instance) destroy_component(switch_instance, detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LifeBar', slots, []);
    	let { System } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<LifeBar> was created without expected prop 'System'");
    		}
    	});

    	const writable_props = ['System'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LifeBar> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({ Bar, System });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [System];
    }

    class LifeBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { System: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LifeBar",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get System() {
    		throw new Error("<LifeBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<LifeBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Menu/Character.svelte generated by Svelte v3.59.2 */

    const file$d = "src/Menu/Character.svelte";

    function create_fragment$d(ctx) {
    	let button;
    	let t0_value = /*character*/ ctx[0].name + "";
    	let t0;
    	let t1;
    	let br;
    	let t2;
    	let t3_value = /*character*/ ctx[0].race + "";
    	let t3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			br = element("br");
    			t2 = space();
    			t3 = text(t3_value);
    			add_location(br, file$d, 14, 4, 269);
    			attr_dev(button, "class", "svelte-18a6hah");
    			add_location(button, file$d, 12, 0, 210);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			append_dev(button, t1);
    			append_dev(button, br);
    			append_dev(button, t2);
    			append_dev(button, t3);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[3], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*character*/ 1 && t0_value !== (t0_value = /*character*/ ctx[0].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*character*/ 1 && t3_value !== (t3_value = /*character*/ ctx[0].race + "")) set_data_dev(t3, t3_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Character', slots, []);
    	let { System } = $$props;
    	let { character } = $$props;

    	function see() {
    		$$invalidate(2, System.game.character = character, System);
    		System.pages.change("Character");
    	}

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<Character> was created without expected prop 'System'");
    		}

    		if (character === undefined && !('character' in $$props || $$self.$$.bound[$$self.$$.props['character']])) {
    			console.warn("<Character> was created without expected prop 'character'");
    		}
    	});

    	const writable_props = ['System', 'character'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Character> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		see();
    	};

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(2, System = $$props.System);
    		if ('character' in $$props) $$invalidate(0, character = $$props.character);
    	};

    	$$self.$capture_state = () => ({ System, character, see });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(2, System = $$props.System);
    		if ('character' in $$props) $$invalidate(0, character = $$props.character);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [character, see, System, click_handler];
    }

    let Character$1 = class Character extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { System: 2, character: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Character",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get System() {
    		throw new Error("<Character>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Character>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get character() {
    		throw new Error("<Character>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set character(value) {
    		throw new Error("<Character>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    };

    /* src/Menu/Team.svelte generated by Svelte v3.59.2 */
    const file$c = "src/Menu/Team.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (9:0) {#each System.game.ship.characters as character}
    function create_each_block$6(ctx) {
    	let switch_instance;
    	let t;
    	let br;
    	let current;
    	var switch_value = Character$1;

    	function switch_props(ctx) {
    		return {
    			props: {
    				character: /*character*/ ctx[1],
    				System: /*System*/ ctx[0]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			t = space();
    			br = element("br");
    			add_location(br, file$c, 10, 4, 313);
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, br, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*System*/ 1) switch_instance_changes.character = /*character*/ ctx[1];
    			if (dirty & /*System*/ 1) switch_instance_changes.System = /*System*/ ctx[0];

    			if (switch_value !== (switch_value = Character$1)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, t.parentNode, t);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (switch_instance) destroy_component(switch_instance, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(br);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(9:0) {#each System.game.ship.characters as character}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let t0;
    	let t1_value = /*System*/ ctx[0].game.ship.characters.length + "";
    	let t1;
    	let t2;
    	let t3_value = /*System*/ ctx[0].game.ship.characters_max() + "";
    	let t3;
    	let t4;
    	let br;
    	let t5;
    	let each_1_anchor;
    	let current;
    	let each_value = /*System*/ ctx[0].game.ship.characters;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			t0 = text("Équipage : (");
    			t1 = text(t1_value);
    			t2 = text(" / ");
    			t3 = text(t3_value);
    			t4 = text(")\n");
    			br = element("br");
    			t5 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			add_location(br, file$c, 7, 0, 191);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, br, anchor);
    			insert_dev(target, t5, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*System*/ 1) && t1_value !== (t1_value = /*System*/ ctx[0].game.ship.characters.length + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*System*/ 1) && t3_value !== (t3_value = /*System*/ ctx[0].game.ship.characters_max() + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*Character, System*/ 1) {
    				each_value = /*System*/ ctx[0].game.ship.characters;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t5);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Team', slots, []);
    	let { System } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<Team> was created without expected prop 'System'");
    		}
    	});

    	const writable_props = ['System'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Team> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({ Character: Character$1, System });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [System];
    }

    class Team extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { System: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Team",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get System() {
    		throw new Error("<Team>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Team>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Menu/Ship.svelte generated by Svelte v3.59.2 */

    const file$b = "src/Menu/Ship.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (17:4) {#each System.game.ship.parts as part}
    function create_each_block$5(ctx) {
    	let button;
    	let div0;
    	let t0_value = /*part*/ ctx[6].name + "";
    	let t0;
    	let t1;
    	let div1;
    	let t2;
    	let t3_value = /*part*/ ctx[6].level + "";
    	let t3;
    	let t4;
    	let mounted;
    	let dispose;

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[5](/*part*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			t2 = text("Lv ");
    			t3 = text(t3_value);
    			t4 = space();
    			add_location(div0, file$b, 18, 12, 513);
    			set_style(div1, "text-align", "right");
    			add_location(div1, file$b, 21, 12, 578);
    			attr_dev(button, "class", "part svelte-ss0fbq");
    			add_location(button, file$b, 17, 8, 439);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, div0);
    			append_dev(div0, t0);
    			append_dev(button, t1);
    			append_dev(button, div1);
    			append_dev(div1, t2);
    			append_dev(div1, t3);
    			append_dev(button, t4);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", click_handler_2, false, false, false, false),
    					listen_dev(button, "keydown", /*keydown_handler*/ ctx[2], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*System*/ 1 && t0_value !== (t0_value = /*part*/ ctx[6].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*System*/ 1 && t3_value !== (t3_value = /*part*/ ctx[6].level + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(17:4) {#each System.game.ship.parts as part}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div0;
    	let button0;
    	let t0_value = /*System*/ ctx[0].game.ship.name + "";
    	let t0;
    	let t1;
    	let button1;
    	let t3;
    	let br;
    	let t4;
    	let div1;
    	let mounted;
    	let dispose;
    	let each_value = /*System*/ ctx[0].game.ship.parts;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			button0 = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "Améliorer";
    			t3 = space();
    			br = element("br");
    			t4 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(button0, file$b, 11, 4, 182);
    			add_location(button1, file$b, 12, 4, 274);
    			attr_dev(div0, "class", "title svelte-ss0fbq");
    			add_location(div0, file$b, 10, 0, 158);
    			add_location(br, file$b, 14, 0, 358);
    			attr_dev(div1, "class", "container svelte-ss0fbq");
    			add_location(div1, file$b, 15, 0, 364);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, button0);
    			append_dev(button0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, button1);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, br, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div1, null);
    				}
    			}

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[3], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[4], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*System*/ 1 && t0_value !== (t0_value = /*System*/ ctx[0].game.ship.name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*see, System*/ 3) {
    				each_value = /*System*/ ctx[0].game.ship.parts;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Ship', slots, []);
    	let { System } = $$props;

    	function see(part) {
    		$$invalidate(0, System.game.part = part, System);
    		System.pages.change("Part");
    	}

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<Ship> was created without expected prop 'System'");
    		}
    	});

    	const writable_props = ['System'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Ship> was created with unknown prop '${key}'`);
    	});

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const click_handler = () => System.pages.change("Ship");
    	const click_handler_1 = () => System.pages.change("Upgrade");

    	const click_handler_2 = part => {
    		see(part);
    	};

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({ System, see });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [System, see, keydown_handler, click_handler, click_handler_1, click_handler_2];
    }

    let Ship$1 = class Ship extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { System: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Ship",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get System() {
    		throw new Error("<Ship>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Ship>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    };

    /* src/Menu/Menu.svelte generated by Svelte v3.59.2 */
    const file$a = "src/Menu/Menu.svelte";

    function create_fragment$a(ctx) {
    	let div6;
    	let div2;
    	let div0;
    	let switch_instance0;
    	let t0;
    	let div1;
    	let t1_value = /*System*/ ctx[0].game.ship.fuel + "";
    	let t1;
    	let t2;
    	let br0;
    	let t3;
    	let t4_value = /*System*/ ctx[0].game.steel + "";
    	let t4;
    	let t5;
    	let br1;
    	let t6;
    	let t7_value = /*System*/ ctx[0].game.money + "";
    	let t7;
    	let t8;
    	let t9;
    	let div3;
    	let button0;
    	let t11;
    	let button1;
    	let t13;
    	let div4;
    	let switch_instance1;
    	let t14;
    	let div5;
    	let switch_instance2;
    	let current;
    	let mounted;
    	let dispose;
    	var switch_value = LifeBar;

    	function switch_props(ctx) {
    		return {
    			props: { System: /*System*/ ctx[0] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance0 = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	var switch_value_1 = Team;

    	function switch_props_1(ctx) {
    		return {
    			props: { System: /*System*/ ctx[0] },
    			$$inline: true
    		};
    	}

    	if (switch_value_1) {
    		switch_instance1 = construct_svelte_component_dev(switch_value_1, switch_props_1(ctx));
    	}

    	var switch_value_2 = Ship$1;

    	function switch_props_2(ctx) {
    		return {
    			props: { System: /*System*/ ctx[0] },
    			$$inline: true
    		};
    	}

    	if (switch_value_2) {
    		switch_instance2 = construct_svelte_component_dev(switch_value_2, switch_props_2(ctx));
    	}

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			if (switch_instance0) create_component(switch_instance0.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			t1 = text(t1_value);
    			t2 = text(" Carburant\n            ");
    			br0 = element("br");
    			t3 = space();
    			t4 = text(t4_value);
    			t5 = text(" Acier\n            ");
    			br1 = element("br");
    			t6 = space();
    			t7 = text(t7_value);
    			t8 = text(" $");
    			t9 = space();
    			div3 = element("div");
    			button0 = element("button");
    			button0.textContent = "Système solaire";
    			t11 = space();
    			button1 = element("button");
    			button1.textContent = "Galaxie";
    			t13 = space();
    			div4 = element("div");
    			if (switch_instance1) create_component(switch_instance1.$$.fragment);
    			t14 = space();
    			div5 = element("div");
    			if (switch_instance2) create_component(switch_instance2.$$.fragment);
    			add_location(div0, file$a, 10, 8, 232);
    			add_location(br0, file$a, 15, 12, 408);
    			add_location(br1, file$a, 17, 12, 464);
    			set_style(div1, "text-align", "right");
    			add_location(div1, file$a, 13, 8, 318);
    			attr_dev(div2, "class", "status svelte-1w2g158");
    			add_location(div2, file$a, 9, 4, 203);
    			add_location(button0, file$a, 22, 8, 560);
    			add_location(button1, file$a, 23, 8, 650);
    			attr_dev(div3, "class", "map svelte-1w2g158");
    			add_location(div3, file$a, 21, 4, 534);
    			attr_dev(div4, "class", "team svelte-1w2g158");
    			add_location(div4, file$a, 25, 4, 736);
    			attr_dev(div5, "class", "ship svelte-1w2g158");
    			add_location(div5, file$a, 28, 4, 820);
    			attr_dev(div6, "class", "container svelte-1w2g158");
    			add_location(div6, file$a, 8, 0, 175);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div2);
    			append_dev(div2, div0);
    			if (switch_instance0) mount_component(switch_instance0, div0, null);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, t1);
    			append_dev(div1, t2);
    			append_dev(div1, br0);
    			append_dev(div1, t3);
    			append_dev(div1, t4);
    			append_dev(div1, t5);
    			append_dev(div1, br1);
    			append_dev(div1, t6);
    			append_dev(div1, t7);
    			append_dev(div1, t8);
    			append_dev(div6, t9);
    			append_dev(div6, div3);
    			append_dev(div3, button0);
    			append_dev(div3, t11);
    			append_dev(div3, button1);
    			append_dev(div6, t13);
    			append_dev(div6, div4);
    			if (switch_instance1) mount_component(switch_instance1, div4, null);
    			append_dev(div6, t14);
    			append_dev(div6, div5);
    			if (switch_instance2) mount_component(switch_instance2, div5, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[1], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[2], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance0_changes = {};
    			if (dirty & /*System*/ 1) switch_instance0_changes.System = /*System*/ ctx[0];

    			if (switch_value !== (switch_value = LifeBar)) {
    				if (switch_instance0) {
    					group_outros();
    					const old_component = switch_instance0;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance0 = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					create_component(switch_instance0.$$.fragment);
    					transition_in(switch_instance0.$$.fragment, 1);
    					mount_component(switch_instance0, div0, null);
    				} else {
    					switch_instance0 = null;
    				}
    			} else if (switch_value) {
    				switch_instance0.$set(switch_instance0_changes);
    			}

    			if ((!current || dirty & /*System*/ 1) && t1_value !== (t1_value = /*System*/ ctx[0].game.ship.fuel + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*System*/ 1) && t4_value !== (t4_value = /*System*/ ctx[0].game.steel + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty & /*System*/ 1) && t7_value !== (t7_value = /*System*/ ctx[0].game.money + "")) set_data_dev(t7, t7_value);
    			const switch_instance1_changes = {};
    			if (dirty & /*System*/ 1) switch_instance1_changes.System = /*System*/ ctx[0];

    			if (switch_value_1 !== (switch_value_1 = Team)) {
    				if (switch_instance1) {
    					group_outros();
    					const old_component = switch_instance1;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value_1) {
    					switch_instance1 = construct_svelte_component_dev(switch_value_1, switch_props_1(ctx));
    					create_component(switch_instance1.$$.fragment);
    					transition_in(switch_instance1.$$.fragment, 1);
    					mount_component(switch_instance1, div4, null);
    				} else {
    					switch_instance1 = null;
    				}
    			} else if (switch_value_1) {
    				switch_instance1.$set(switch_instance1_changes);
    			}

    			const switch_instance2_changes = {};
    			if (dirty & /*System*/ 1) switch_instance2_changes.System = /*System*/ ctx[0];

    			if (switch_value_2 !== (switch_value_2 = Ship$1)) {
    				if (switch_instance2) {
    					group_outros();
    					const old_component = switch_instance2;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value_2) {
    					switch_instance2 = construct_svelte_component_dev(switch_value_2, switch_props_2(ctx));
    					create_component(switch_instance2.$$.fragment);
    					transition_in(switch_instance2.$$.fragment, 1);
    					mount_component(switch_instance2, div5, null);
    				} else {
    					switch_instance2 = null;
    				}
    			} else if (switch_value_2) {
    				switch_instance2.$set(switch_instance2_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance0) transition_in(switch_instance0.$$.fragment, local);
    			if (switch_instance1) transition_in(switch_instance1.$$.fragment, local);
    			if (switch_instance2) transition_in(switch_instance2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance0) transition_out(switch_instance0.$$.fragment, local);
    			if (switch_instance1) transition_out(switch_instance1.$$.fragment, local);
    			if (switch_instance2) transition_out(switch_instance2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			if (switch_instance0) destroy_component(switch_instance0);
    			if (switch_instance1) destroy_component(switch_instance1);
    			if (switch_instance2) destroy_component(switch_instance2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Menu', slots, []);
    	let { System } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<Menu> was created without expected prop 'System'");
    		}
    	});

    	const writable_props = ['System'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Menu> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		System.pages.change("Sector");
    	};

    	const click_handler_1 = () => {
    		System.pages.change("Map");
    	};

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({ LifeBar, Team, Ship: Ship$1, System });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [System, click_handler, click_handler_1];
    }

    class Menu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { System: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Menu",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get System() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Ship.svelte generated by Svelte v3.59.2 */

    const file$9 = "src/Ship.svelte";

    // (13:4) {#if System.game.ship.shield_max() > 0}
    function create_if_block_4$1(ctx) {
    	let t0;
    	let t1_value = /*System*/ ctx[0].game.ship.shield_max() + "";
    	let t1;
    	let t2;
    	let br;

    	const block = {
    		c: function create() {
    			t0 = text("Bouclier maximal : ");
    			t1 = text(t1_value);
    			t2 = space();
    			br = element("br");
    			add_location(br, file$9, 14, 8, 374);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, br, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*System*/ 1 && t1_value !== (t1_value = /*System*/ ctx[0].game.ship.shield_max() + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(br);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(13:4) {#if System.game.ship.shield_max() > 0}",
    		ctx
    	});

    	return block;
    }

    // (17:4) {#if System.game.ship.damageAdd() > 0}
    function create_if_block_3$3(ctx) {
    	let t0;
    	let t1_value = /*System*/ ctx[0].game.ship.damageAdd() + "";
    	let t1;
    	let t2;
    	let br;

    	const block = {
    		c: function create() {
    			t0 = text("Dégâts supplémentaires : ");
    			t1 = text(t1_value);
    			t2 = space();
    			br = element("br");
    			add_location(br, file$9, 18, 8, 505);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, br, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*System*/ 1 && t1_value !== (t1_value = /*System*/ ctx[0].game.ship.damageAdd() + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(br);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$3.name,
    		type: "if",
    		source: "(17:4) {#if System.game.ship.damageAdd() > 0}",
    		ctx
    	});

    	return block;
    }

    // (21:4) {#if System.game.ship.damageProd() > 1}
    function create_if_block_2$3(ctx) {
    	let t0;
    	let t1_value = 100 * /*System*/ ctx[0].game.ship.damageProd() + "";
    	let t1;
    	let t2;
    	let br;

    	const block = {
    		c: function create() {
    			t0 = text("Multiplicateur de dégâts : ");
    			t1 = text(t1_value);
    			t2 = text("%\n        ");
    			br = element("br");
    			add_location(br, file$9, 22, 8, 645);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, br, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*System*/ 1 && t1_value !== (t1_value = 100 * /*System*/ ctx[0].game.ship.damageProd() + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(br);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(21:4) {#if System.game.ship.damageProd() > 1}",
    		ctx
    	});

    	return block;
    }

    // (25:4) {#if System.game.ship.defense() > 0}
    function create_if_block_1$4(ctx) {
    	let t0;
    	let t1_value = /*System*/ ctx[0].game.ship.defense() + "";
    	let t1;
    	let t2;
    	let br;

    	const block = {
    		c: function create() {
    			t0 = text("Réduction de dégât : ");
    			t1 = text(t1_value);
    			t2 = space();
    			br = element("br");
    			add_location(br, file$9, 26, 8, 768);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, br, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*System*/ 1 && t1_value !== (t1_value = /*System*/ ctx[0].game.ship.defense() + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(br);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(25:4) {#if System.game.ship.defense() > 0}",
    		ctx
    	});

    	return block;
    }

    // (31:4) {#if System.game.ship.accuracy() > 0}
    function create_if_block$4(ctx) {
    	let t0;
    	let t1_value = /*System*/ ctx[0].game.ship.accuracy() + "";
    	let t1;
    	let t2;
    	let br;

    	const block = {
    		c: function create() {
    			t0 = text("Précision bonus : ");
    			t1 = text(t1_value);
    			t2 = space();
    			br = element("br");
    			add_location(br, file$9, 32, 8, 954);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, br, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*System*/ 1 && t1_value !== (t1_value = /*System*/ ctx[0].game.ship.accuracy() + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(br);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(31:4) {#if System.game.ship.accuracy() > 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div;
    	let button;
    	let t1;
    	let br0;
    	let t2;
    	let t3_value = /*System*/ ctx[0].game.ship.name + "";
    	let t3;
    	let t4;
    	let br1;
    	let br2;
    	let t5;
    	let t6_value = /*System*/ ctx[0].game.ship.life_max() + "";
    	let t6;
    	let t7;
    	let br3;
    	let t8;
    	let show_if_4 = /*System*/ ctx[0].game.ship.shield_max() > 0;
    	let t9;
    	let show_if_3 = /*System*/ ctx[0].game.ship.damageAdd() > 0;
    	let t10;
    	let show_if_2 = /*System*/ ctx[0].game.ship.damageProd() > 1;
    	let t11;
    	let show_if_1 = /*System*/ ctx[0].game.ship.defense() > 0;
    	let t12;
    	let t13_value = 100 * /*System*/ ctx[0].game.ship.avoid() + "";
    	let t13;
    	let t14;
    	let br4;
    	let t15;
    	let show_if = /*System*/ ctx[0].game.ship.accuracy() > 0;
    	let t16;
    	let t17_value = /*System*/ ctx[0].game.ship.energy_max() + "";
    	let t17;
    	let t18;
    	let br5;
    	let mounted;
    	let dispose;
    	let if_block0 = show_if_4 && create_if_block_4$1(ctx);
    	let if_block1 = show_if_3 && create_if_block_3$3(ctx);
    	let if_block2 = show_if_2 && create_if_block_2$3(ctx);
    	let if_block3 = show_if_1 && create_if_block_1$4(ctx);
    	let if_block4 = show_if && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			button.textContent = "Retour";
    			t1 = space();
    			br0 = element("br");
    			t2 = space();
    			t3 = text(t3_value);
    			t4 = space();
    			br1 = element("br");
    			br2 = element("br");
    			t5 = text("\n    Vie maximale : ");
    			t6 = text(t6_value);
    			t7 = space();
    			br3 = element("br");
    			t8 = space();
    			if (if_block0) if_block0.c();
    			t9 = space();
    			if (if_block1) if_block1.c();
    			t10 = space();
    			if (if_block2) if_block2.c();
    			t11 = space();
    			if (if_block3) if_block3.c();
    			t12 = text("\n    Chance d'equive : ");
    			t13 = text(t13_value);
    			t14 = text("%\n    ");
    			br4 = element("br");
    			t15 = space();
    			if (if_block4) if_block4.c();
    			t16 = text("\n    Énergie maximale : ");
    			t17 = text(t17_value);
    			t18 = space();
    			br5 = element("br");
    			add_location(button, file$9, 6, 4, 80);
    			add_location(br0, file$9, 7, 4, 155);
    			add_location(br1, file$9, 9, 4, 193);
    			add_location(br2, file$9, 9, 9, 198);
    			add_location(br3, file$9, 11, 4, 257);
    			add_location(br4, file$9, 29, 4, 842);
    			add_location(br5, file$9, 35, 4, 1029);
    			attr_dev(div, "class", "center");
    			add_location(div, file$9, 5, 0, 55);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(div, t1);
    			append_dev(div, br0);
    			append_dev(div, t2);
    			append_dev(div, t3);
    			append_dev(div, t4);
    			append_dev(div, br1);
    			append_dev(div, br2);
    			append_dev(div, t5);
    			append_dev(div, t6);
    			append_dev(div, t7);
    			append_dev(div, br3);
    			append_dev(div, t8);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t9);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t10);
    			if (if_block2) if_block2.m(div, null);
    			append_dev(div, t11);
    			if (if_block3) if_block3.m(div, null);
    			append_dev(div, t12);
    			append_dev(div, t13);
    			append_dev(div, t14);
    			append_dev(div, br4);
    			append_dev(div, t15);
    			if (if_block4) if_block4.m(div, null);
    			append_dev(div, t16);
    			append_dev(div, t17);
    			append_dev(div, t18);
    			append_dev(div, br5);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[1], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*System*/ 1 && t3_value !== (t3_value = /*System*/ ctx[0].game.ship.name + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*System*/ 1 && t6_value !== (t6_value = /*System*/ ctx[0].game.ship.life_max() + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*System*/ 1) show_if_4 = /*System*/ ctx[0].game.ship.shield_max() > 0;

    			if (show_if_4) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_4$1(ctx);
    					if_block0.c();
    					if_block0.m(div, t9);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*System*/ 1) show_if_3 = /*System*/ ctx[0].game.ship.damageAdd() > 0;

    			if (show_if_3) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_3$3(ctx);
    					if_block1.c();
    					if_block1.m(div, t10);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*System*/ 1) show_if_2 = /*System*/ ctx[0].game.ship.damageProd() > 1;

    			if (show_if_2) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_2$3(ctx);
    					if_block2.c();
    					if_block2.m(div, t11);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (dirty & /*System*/ 1) show_if_1 = /*System*/ ctx[0].game.ship.defense() > 0;

    			if (show_if_1) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_1$4(ctx);
    					if_block3.c();
    					if_block3.m(div, t12);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (dirty & /*System*/ 1 && t13_value !== (t13_value = 100 * /*System*/ ctx[0].game.ship.avoid() + "")) set_data_dev(t13, t13_value);
    			if (dirty & /*System*/ 1) show_if = /*System*/ ctx[0].game.ship.accuracy() > 0;

    			if (show_if) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block$4(ctx);
    					if_block4.c();
    					if_block4.m(div, t16);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (dirty & /*System*/ 1 && t17_value !== (t17_value = /*System*/ ctx[0].game.ship.energy_max() + "")) set_data_dev(t17, t17_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Ship', slots, []);
    	let { System } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<Ship> was created without expected prop 'System'");
    		}
    	});

    	const writable_props = ['System'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Ship> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		System.pages.change("Menu");
    	};

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({ System });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [System, click_handler];
    }

    class Ship extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { System: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Ship",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get System() {
    		throw new Error("<Ship>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Ship>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Character.svelte generated by Svelte v3.59.2 */
    const file$8 = "src/Character.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (16:4) {#each System.game.character.listSkill() as skill}
    function create_each_block$4(ctx) {
    	let t0_value = /*skill*/ ctx[2].name + "";
    	let t0;
    	let t1;
    	let t2_value = /*skill*/ ctx[2].level + "";
    	let t2;
    	let t3;
    	let br0;
    	let t4;
    	let switch_instance;
    	let t5;
    	let br1;
    	let t6;
    	let div;
    	let t7_value = /*skill*/ ctx[2].description + "";
    	let t7;
    	let t8;
    	let current;
    	var switch_value = Bar;

    	function switch_props(ctx) {
    		return {
    			props: {
    				name: "Expérience",
    				value: /*skill*/ ctx[2].xp,
    				max: 100,
    				color: "cyan"
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = text(" Lv ");
    			t2 = text(t2_value);
    			t3 = space();
    			br0 = element("br");
    			t4 = space();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			t5 = space();
    			br1 = element("br");
    			t6 = space();
    			div = element("div");
    			t7 = text(t7_value);
    			t8 = space();
    			add_location(br0, file$8, 17, 8, 576);
    			add_location(br1, file$8, 19, 8, 691);
    			set_style(div, "margin-left", "3vw");
    			add_location(div, file$8, 20, 8, 705);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, t4, anchor);
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, t7);
    			append_dev(div, t8);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*System*/ 1) && t0_value !== (t0_value = /*skill*/ ctx[2].name + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty & /*System*/ 1) && t2_value !== (t2_value = /*skill*/ ctx[2].level + "")) set_data_dev(t2, t2_value);
    			const switch_instance_changes = {};
    			if (dirty & /*System*/ 1) switch_instance_changes.value = /*skill*/ ctx[2].xp;

    			if (switch_value !== (switch_value = Bar)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, t5.parentNode, t5);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}

    			if ((!current || dirty & /*System*/ 1) && t7_value !== (t7_value = /*skill*/ ctx[2].description + "")) set_data_dev(t7, t7_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(t4);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(16:4) {#each System.game.character.listSkill() as skill}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div;
    	let button;
    	let t1;
    	let br0;
    	let br1;
    	let t2;
    	let t3_value = /*System*/ ctx[0].game.character.name + "";
    	let t3;
    	let t4;
    	let br2;
    	let t5;
    	let t6_value = /*System*/ ctx[0].game.character.race + "";
    	let t6;
    	let t7;
    	let t8_value = /*System*/ ctx[0].game.character.sexe + "";
    	let t8;
    	let t9;
    	let br3;
    	let br4;
    	let t10;
    	let switch_instance;
    	let t11;
    	let br5;
    	let br6;
    	let t12;
    	let current;
    	let mounted;
    	let dispose;
    	var switch_value = Bar;

    	function switch_props(ctx) {
    		return {
    			props: {
    				name: "Vie",
    				value: /*System*/ ctx[0].game.character.life,
    				max: /*System*/ ctx[0].game.character.life_max(),
    				color: "green"
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	let each_value = /*System*/ ctx[0].game.character.listSkill();
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			button.textContent = "Retour";
    			t1 = space();
    			br0 = element("br");
    			br1 = element("br");
    			t2 = space();
    			t3 = text(t3_value);
    			t4 = space();
    			br2 = element("br");
    			t5 = space();
    			t6 = text(t6_value);
    			t7 = space();
    			t8 = text(t8_value);
    			t9 = space();
    			br3 = element("br");
    			br4 = element("br");
    			t10 = space();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			t11 = space();
    			br5 = element("br");
    			br6 = element("br");
    			t12 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(button, file$8, 7, 4, 116);
    			add_location(br0, file$8, 8, 4, 191);
    			add_location(br1, file$8, 8, 9, 196);
    			add_location(br2, file$8, 10, 4, 239);
    			add_location(br3, file$8, 12, 4, 311);
    			add_location(br4, file$8, 12, 9, 316);
    			add_location(br5, file$8, 14, 4, 464);
    			add_location(br6, file$8, 14, 9, 469);
    			attr_dev(div, "class", "center");
    			add_location(div, file$8, 6, 0, 91);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(div, t1);
    			append_dev(div, br0);
    			append_dev(div, br1);
    			append_dev(div, t2);
    			append_dev(div, t3);
    			append_dev(div, t4);
    			append_dev(div, br2);
    			append_dev(div, t5);
    			append_dev(div, t6);
    			append_dev(div, t7);
    			append_dev(div, t8);
    			append_dev(div, t9);
    			append_dev(div, br3);
    			append_dev(div, br4);
    			append_dev(div, t10);
    			if (switch_instance) mount_component(switch_instance, div, null);
    			append_dev(div, t11);
    			append_dev(div, br5);
    			append_dev(div, br6);
    			append_dev(div, t12);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div, null);
    				}
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[1], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*System*/ 1) && t3_value !== (t3_value = /*System*/ ctx[0].game.character.name + "")) set_data_dev(t3, t3_value);
    			if ((!current || dirty & /*System*/ 1) && t6_value !== (t6_value = /*System*/ ctx[0].game.character.race + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty & /*System*/ 1) && t8_value !== (t8_value = /*System*/ ctx[0].game.character.sexe + "")) set_data_dev(t8, t8_value);
    			const switch_instance_changes = {};
    			if (dirty & /*System*/ 1) switch_instance_changes.value = /*System*/ ctx[0].game.character.life;
    			if (dirty & /*System*/ 1) switch_instance_changes.max = /*System*/ ctx[0].game.character.life_max();

    			if (switch_value !== (switch_value = Bar)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div, t11);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}

    			if (dirty & /*System, Bar*/ 1) {
    				each_value = /*System*/ ctx[0].game.character.listSkill();
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (switch_instance) destroy_component(switch_instance);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Character', slots, []);
    	let { System } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<Character> was created without expected prop 'System'");
    		}
    	});

    	const writable_props = ['System'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Character> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		System.pages.change("Menu");
    	};

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({ Bar, System });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [System, click_handler];
    }

    class Character extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { System: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Character",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get System() {
    		throw new Error("<Character>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Character>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Part.svelte generated by Svelte v3.59.2 */

    const file$7 = "src/Part.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (18:8) {:else}
    function create_else_block_2(ctx) {
    	let t0;
    	let t1_value = /*level*/ ctx[4].level + "";
    	let t1;
    	let t2;
    	let t3_value = /*level*/ ctx[4].text + "";
    	let t3;

    	const block = {
    		c: function create() {
    			t0 = text("Lv ");
    			t1 = text(t1_value);
    			t2 = text(" : ");
    			t3 = text(t3_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, t3, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*System*/ 1 && t1_value !== (t1_value = /*level*/ ctx[4].level + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*System*/ 1 && t3_value !== (t3_value = /*level*/ ctx[4].text + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(t3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(18:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (16:8) {#if level.level != System.game.part.level}
    function create_if_block_3$2(ctx) {
    	let div;
    	let t0;
    	let t1_value = /*level*/ ctx[4].level + "";
    	let t1;
    	let t2;
    	let t3_value = /*level*/ ctx[4].text + "";
    	let t3;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("Lv ");
    			t1 = text(t1_value);
    			t2 = text(" : ");
    			t3 = text(t3_value);
    			attr_dev(div, "class", "inactif svelte-kzoow0");
    			add_location(div, file$7, 16, 12, 395);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, t2);
    			append_dev(div, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*System*/ 1 && t1_value !== (t1_value = /*level*/ ctx[4].level + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*System*/ 1 && t3_value !== (t3_value = /*level*/ ctx[4].text + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(16:8) {#if level.level != System.game.part.level}",
    		ctx
    	});

    	return block;
    }

    // (15:4) {#each System.game.part.levels as level}
    function create_each_block$3(ctx) {
    	let t;
    	let br;

    	function select_block_type(ctx, dirty) {
    		if (/*level*/ ctx[4].level != /*System*/ ctx[0].game.part.level) return create_if_block_3$2;
    		return create_else_block_2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			t = space();
    			br = element("br");
    			add_location(br, file$7, 20, 8, 536);
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, br, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(t.parentNode, t);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(br);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(15:4) {#each System.game.part.levels as level}",
    		ctx
    	});

    	return block;
    }

    // (34:4) {:else}
    function create_else_block_1$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Niveau max. atteint");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$2.name,
    		type: "else",
    		source: "(34:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (24:4) {#if part.level < part.levels.length}
    function create_if_block_1$3(ctx) {
    	let t0;
    	let div;
    	let t1;
    	let t2_value = /*part*/ ctx[1].levels[/*part*/ ctx[1].level].price + "";
    	let t2;
    	let t3;

    	function select_block_type_2(ctx, dirty) {
    		if (/*System*/ ctx[0].game.steel >= /*part*/ ctx[1].levels[/*part*/ ctx[1].level].price) return create_if_block_2$2;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			t0 = space();
    			div = element("div");
    			t1 = text("-");
    			t2 = text(t2_value);
    			t3 = text(" Acier");
    			attr_dev(div, "class", "cost");
    			add_location(div, file$7, 32, 8, 938);
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, t1);
    			append_dev(div, t2);
    			append_dev(div, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(t0.parentNode, t0);
    				}
    			}

    			if (dirty & /*part*/ 2 && t2_value !== (t2_value = /*part*/ ctx[1].levels[/*part*/ ctx[1].level].price + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(24:4) {#if part.level < part.levels.length}",
    		ctx
    	});

    	return block;
    }

    // (30:8) {:else}
    function create_else_block$3(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Améliorer";
    			attr_dev(button, "class", "lock");
    			add_location(button, file$7, 30, 12, 876);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(30:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (25:8) {#if System.game.steel >= part.levels[part.level].price}
    function create_if_block_2$2(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Améiorer";
    			add_location(button, file$7, 25, 12, 683);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[3], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(25:8) {#if System.game.steel >= part.levels[part.level].price}",
    		ctx
    	});

    	return block;
    }

    // (38:4) {#if System.game.part.weapon}
    function create_if_block$3(ctx) {
    	let t0;
    	let br;
    	let t1;
    	let t2_value = /*System*/ ctx[0].game.part.attack.description() + "";
    	let t2;
    	let t3;
    	let div;
    	let t4_value = /*System*/ ctx[0].game.part.attack.cost() + "";
    	let t4;

    	const block = {
    		c: function create() {
    			t0 = text("Action en combat\n        ");
    			br = element("br");
    			t1 = space();
    			t2 = text(t2_value);
    			t3 = space();
    			div = element("div");
    			t4 = text(t4_value);
    			add_location(br, file$7, 39, 8, 1133);
    			attr_dev(div, "class", "cost");
    			add_location(div, file$7, 41, 8, 1195);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, br, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, t4);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*System*/ 1 && t2_value !== (t2_value = /*System*/ ctx[0].game.part.attack.description() + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*System*/ 1 && t4_value !== (t4_value = /*System*/ ctx[0].game.part.attack.cost() + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(38:4) {#if System.game.part.weapon}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div;
    	let button;
    	let t1;
    	let br0;
    	let br1;
    	let t2;
    	let t3_value = /*System*/ ctx[0].game.part.name + "";
    	let t3;
    	let t4;
    	let br2;
    	let t5;
    	let t6_value = /*System*/ ctx[0].game.part.description + "";
    	let t6;
    	let t7;
    	let br3;
    	let br4;
    	let t8;
    	let t9;
    	let br5;
    	let t10;
    	let t11;
    	let br6;
    	let br7;
    	let t12;
    	let mounted;
    	let dispose;
    	let each_value = /*System*/ ctx[0].game.part.levels;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	function select_block_type_1(ctx, dirty) {
    		if (/*part*/ ctx[1].level < /*part*/ ctx[1].levels.length) return create_if_block_1$3;
    		return create_else_block_1$2;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*System*/ ctx[0].game.part.weapon && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			button.textContent = "Retour";
    			t1 = space();
    			br0 = element("br");
    			br1 = element("br");
    			t2 = space();
    			t3 = text(t3_value);
    			t4 = space();
    			br2 = element("br");
    			t5 = space();
    			t6 = text(t6_value);
    			t7 = space();
    			br3 = element("br");
    			br4 = element("br");
    			t8 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t9 = space();
    			br5 = element("br");
    			t10 = space();
    			if_block0.c();
    			t11 = space();
    			br6 = element("br");
    			br7 = element("br");
    			t12 = space();
    			if (if_block1) if_block1.c();
    			add_location(button, file$7, 8, 4, 112);
    			add_location(br0, file$7, 9, 4, 187);
    			add_location(br1, file$7, 9, 9, 192);
    			add_location(br2, file$7, 11, 4, 230);
    			add_location(br3, file$7, 13, 4, 275);
    			add_location(br4, file$7, 13, 9, 280);
    			add_location(br5, file$7, 22, 4, 558);
    			add_location(br6, file$7, 36, 4, 1055);
    			add_location(br7, file$7, 36, 9, 1060);
    			attr_dev(div, "class", "center");
    			add_location(div, file$7, 7, 0, 87);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(div, t1);
    			append_dev(div, br0);
    			append_dev(div, br1);
    			append_dev(div, t2);
    			append_dev(div, t3);
    			append_dev(div, t4);
    			append_dev(div, br2);
    			append_dev(div, t5);
    			append_dev(div, t6);
    			append_dev(div, t7);
    			append_dev(div, br3);
    			append_dev(div, br4);
    			append_dev(div, t8);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div, null);
    				}
    			}

    			append_dev(div, t9);
    			append_dev(div, br5);
    			append_dev(div, t10);
    			if_block0.m(div, null);
    			append_dev(div, t11);
    			append_dev(div, br6);
    			append_dev(div, br7);
    			append_dev(div, t12);
    			if (if_block1) if_block1.m(div, null);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*System*/ 1 && t3_value !== (t3_value = /*System*/ ctx[0].game.part.name + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*System*/ 1 && t6_value !== (t6_value = /*System*/ ctx[0].game.part.description + "")) set_data_dev(t6, t6_value);

    			if (dirty & /*System*/ 1) {
    				each_value = /*System*/ ctx[0].game.part.levels;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, t9);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div, t11);
    				}
    			}

    			if (/*System*/ ctx[0].game.part.weapon) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$3(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let part;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Part', slots, []);
    	let { System } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<Part> was created without expected prop 'System'");
    		}
    	});

    	const writable_props = ['System'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Part> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		System.pages.change("Menu");
    	};

    	const click_handler_1 = () => {
    		$$invalidate(0, System.game.steel -= part.levels[part.level].price, System);
    		part.upgrade(System);
    	};

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({ System, part });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    		if ('part' in $$props) $$invalidate(1, part = $$props.part);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*System*/ 1) {
    			$$invalidate(1, part = System.game.part);
    		}
    	};

    	return [System, part, click_handler, click_handler_1];
    }

    class Part extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { System: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Part",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get System() {
    		throw new Error("<Part>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Part>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Upgrade.svelte generated by Svelte v3.59.2 */

    const file$6 = "src/Upgrade.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (29:12) {:else}
    function create_else_block_1$1(ctx) {
    	let div0;
    	let button;
    	let t0_value = /*part*/ ctx[3].name + "";
    	let t0;
    	let t1;
    	let t2_value = /*part*/ ctx[3].level + "";
    	let t2;
    	let t3;
    	let div1;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = text(" Nv ");
    			t2 = text(t2_value);
    			t3 = space();
    			div1 = element("div");
    			div1.textContent = "Niveau max. atteint\n                ";
    			add_location(button, file$6, 30, 20, 1117);
    			add_location(div0, file$6, 29, 16, 1091);
    			attr_dev(div1, "class", "info svelte-1mltd6h");
    			add_location(div1, file$6, 32, 16, 1201);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, button);
    			append_dev(button, t0);
    			append_dev(button, t1);
    			append_dev(button, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*System*/ 1 && t0_value !== (t0_value = /*part*/ ctx[3].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*System*/ 1 && t2_value !== (t2_value = /*part*/ ctx[3].level + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(29:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (15:12) {#if part.level < part.levels.length}
    function create_if_block$2(ctx) {
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let t2_value = /*part*/ ctx[3].levels[/*part*/ ctx[3].level].price + "";
    	let t2;
    	let t3;

    	function select_block_type_1(ctx, dirty) {
    		if (/*System*/ ctx[0].game.steel >= /*part*/ ctx[3].levels[/*part*/ ctx[3].level].price) return create_if_block_1$2;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			if_block.c();
    			t0 = space();
    			div1 = element("div");
    			t1 = text("-");
    			t2 = text(t2_value);
    			t3 = text(" Acier\n                ");
    			add_location(div0, file$6, 15, 16, 407);
    			attr_dev(div1, "class", "cost info svelte-1mltd6h");
    			add_location(div1, file$6, 25, 16, 949);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			if_block.m(div0, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t1);
    			append_dev(div1, t2);
    			append_dev(div1, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			}

    			if (dirty & /*System*/ 1 && t2_value !== (t2_value = /*part*/ ctx[3].levels[/*part*/ ctx[3].level].price + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if_block.d();
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(15:12) {#if part.level < part.levels.length}",
    		ctx
    	});

    	return block;
    }

    // (22:20) {:else}
    function create_else_block$2(ctx) {
    	let button;
    	let t0_value = /*part*/ ctx[3].name + "";
    	let t0;
    	let t1;
    	let t2_value = /*part*/ ctx[3].level + "";
    	let t2;
    	let t3;
    	let t4_value = /*part*/ ctx[3].level + 1 + "";
    	let t4;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = text(" Nv ");
    			t2 = text(t2_value);
    			t3 = text(" => ");
    			t4 = text(t4_value);
    			attr_dev(button, "class", "lock");
    			add_location(button, file$6, 22, 24, 806);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			append_dev(button, t1);
    			append_dev(button, t2);
    			append_dev(button, t3);
    			append_dev(button, t4);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*System*/ 1 && t0_value !== (t0_value = /*part*/ ctx[3].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*System*/ 1 && t2_value !== (t2_value = /*part*/ ctx[3].level + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*System*/ 1 && t4_value !== (t4_value = /*part*/ ctx[3].level + 1 + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(22:20) {:else}",
    		ctx
    	});

    	return block;
    }

    // (17:20) {#if System.game.steel >= part.levels[part.level].price}
    function create_if_block_1$2(ctx) {
    	let button;
    	let t0_value = /*part*/ ctx[3].name + "";
    	let t0;
    	let t1;
    	let t2_value = /*part*/ ctx[3].level + "";
    	let t2;
    	let t3;
    	let t4_value = /*part*/ ctx[3].level + 1 + "";
    	let t4;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[2](/*part*/ ctx[3]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = text(" Nv ");
    			t2 = text(t2_value);
    			t3 = text(" => ");
    			t4 = text(t4_value);
    			add_location(button, file$6, 17, 24, 514);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			append_dev(button, t1);
    			append_dev(button, t2);
    			append_dev(button, t3);
    			append_dev(button, t4);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_1, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*System*/ 1 && t0_value !== (t0_value = /*part*/ ctx[3].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*System*/ 1 && t2_value !== (t2_value = /*part*/ ctx[3].level + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*System*/ 1 && t4_value !== (t4_value = /*part*/ ctx[3].level + 1 + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(17:20) {#if System.game.steel >= part.levels[part.level].price}",
    		ctx
    	});

    	return block;
    }

    // (14:8) {#each System.game.ship.parts as part}
    function create_each_block$2(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*part*/ ctx[3].level < /*part*/ ctx[3].levels.length) return create_if_block$2;
    		return create_else_block_1$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(14:8) {#each System.game.ship.parts as part}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div1;
    	let button;
    	let t1;
    	let br0;
    	let br1;
    	let t2;
    	let br2;
    	let br3;
    	let t3;
    	let t4_value = /*System*/ ctx[0].game.steel + "";
    	let t4;
    	let t5;
    	let br4;
    	let br5;
    	let t6;
    	let div0;
    	let mounted;
    	let dispose;
    	let each_value = /*System*/ ctx[0].game.ship.parts;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			button = element("button");
    			button.textContent = "Retour";
    			t1 = space();
    			br0 = element("br");
    			br1 = element("br");
    			t2 = text("\n    Choississez un module à améliorer :\n    ");
    			br2 = element("br");
    			br3 = element("br");
    			t3 = space();
    			t4 = text(t4_value);
    			t5 = text(" Acier\n    ");
    			br4 = element("br");
    			br5 = element("br");
    			t6 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(button, file$6, 6, 4, 80);
    			add_location(br0, file$6, 7, 4, 155);
    			add_location(br1, file$6, 7, 9, 160);
    			add_location(br2, file$6, 9, 4, 210);
    			add_location(br3, file$6, 9, 9, 215);
    			add_location(br4, file$6, 11, 4, 255);
    			add_location(br5, file$6, 11, 9, 260);
    			attr_dev(div0, "class", "container svelte-1mltd6h");
    			add_location(div0, file$6, 12, 4, 270);
    			attr_dev(div1, "class", "center");
    			add_location(div1, file$6, 5, 0, 55);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, button);
    			append_dev(div1, t1);
    			append_dev(div1, br0);
    			append_dev(div1, br1);
    			append_dev(div1, t2);
    			append_dev(div1, br2);
    			append_dev(div1, br3);
    			append_dev(div1, t3);
    			append_dev(div1, t4);
    			append_dev(div1, t5);
    			append_dev(div1, br4);
    			append_dev(div1, br5);
    			append_dev(div1, t6);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div0, null);
    				}
    			}

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[1], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*System*/ 1 && t4_value !== (t4_value = /*System*/ ctx[0].game.steel + "")) set_data_dev(t4, t4_value);

    			if (dirty & /*System*/ 1) {
    				each_value = /*System*/ ctx[0].game.ship.parts;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Upgrade', slots, []);
    	let { System } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<Upgrade> was created without expected prop 'System'");
    		}
    	});

    	const writable_props = ['System'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Upgrade> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		System.pages.change("Menu");
    	};

    	const click_handler_1 = part => {
    		$$invalidate(0, System.game.steel -= part.levels[part.level].price, System);
    		part.upgrade(System);
    	};

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({ System });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [System, click_handler, click_handler_1];
    }

    class Upgrade extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { System: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Upgrade",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get System() {
    		throw new Error("<Upgrade>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Upgrade>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Sector.svelte generated by Svelte v3.59.2 */

    const file$5 = "src/Sector.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (36:62) {:else}
    function create_else_block_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("???");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(36:62) {:else}",
    		ctx
    	});

    	return block;
    }

    // (36:32) {#if planet.info}
    function create_if_block_4(ctx) {
    	let t_value = /*planet*/ ctx[7].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*System*/ 1 && t_value !== (t_value = /*planet*/ ctx[7].name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(36:32) {#if planet.info}",
    		ctx
    	});

    	return block;
    }

    // (31:53) 
    function create_if_block_3$1(ctx) {
    	let div;
    	let t_value = /*planet*/ ctx[7].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "visited svelte-9t18u6");
    			add_location(div, file$5, 31, 32, 1122);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*System*/ 1 && t_value !== (t_value = /*planet*/ ctx[7].name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(31:53) ",
    		ctx
    	});

    	return block;
    }

    // (27:28) {#if planet == System.game.planet}
    function create_if_block_2$1(ctx) {
    	let div;
    	let t_value = /*planet*/ ctx[7].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "current svelte-9t18u6");
    			add_location(div, file$5, 27, 32, 925);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*System*/ 1 && t_value !== (t_value = /*planet*/ ctx[7].name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(27:28) {#if planet == System.game.planet}",
    		ctx
    	});

    	return block;
    }

    // (22:24) {#if i == System.game.planet.step + 1}
    function create_if_block$1(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	function select_block_type_1(ctx, dirty) {
    		if (/*planet*/ ctx[7].info) return create_if_block_1$1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[3](/*planet*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			if_block.c();
    			attr_dev(button, "class", "next svelte-9t18u6");
    			add_location(button, file$5, 22, 28, 628);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			if_block.m(button, null);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_1, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(button, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(22:24) {#if i == System.game.planet.step + 1}",
    		ctx
    	});

    	return block;
    }

    // (24:62) {:else}
    function create_else_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("???");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(24:62) {:else}",
    		ctx
    	});

    	return block;
    }

    // (24:32) {#if planet.info}
    function create_if_block_1$1(ctx) {
    	let t_value = /*planet*/ ctx[7].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*System*/ 1 && t_value !== (t_value = /*planet*/ ctx[7].name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(24:32) {#if planet.info}",
    		ctx
    	});

    	return block;
    }

    // (20:16) {#each step as planet}
    function create_each_block_1$1(ctx) {
    	let div;

    	function select_block_type(ctx, dirty) {
    		if (/*i*/ ctx[6] == /*System*/ ctx[0].game.planet.step + 1) return create_if_block$1;
    		if (/*planet*/ ctx[7] == /*System*/ ctx[0].game.planet) return create_if_block_2$1;
    		if (/*planet*/ ctx[7].visited) return create_if_block_3$1;
    		if (/*planet*/ ctx[7].info) return create_if_block_4;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "planet svelte-9t18u6");
    			add_location(div, file$5, 20, 20, 516);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(20:16) {#each step as planet}",
    		ctx
    	});

    	return block;
    }

    // (15:8) {#each System.game.sector.steps as step, i}
    function create_each_block$1(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let each_value_1 = /*step*/ ctx[4];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text("Étape ");
    			t1 = text(/*i*/ ctx[6]);
    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t3 = space();
    			add_location(div0, file$5, 16, 16, 398);
    			attr_dev(div1, "class", "step svelte-9t18u6");
    			add_location(div1, file$5, 15, 12, 363);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			append_dev(div1, t2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div1, null);
    				}
    			}

    			append_dev(div1, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*next, System*/ 3) {
    				each_value_1 = /*step*/ ctx[4];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, t3);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(15:8) {#each System.game.sector.steps as step, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div1;
    	let button;
    	let t1;
    	let br0;
    	let br1;
    	let t2;
    	let div0;
    	let mounted;
    	let dispose;
    	let each_value = /*System*/ ctx[0].game.sector.steps;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			button = element("button");
    			button.textContent = "Retour";
    			t1 = space();
    			br0 = element("br");
    			br1 = element("br");
    			t2 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(button, file$5, 11, 4, 188);
    			add_location(br0, file$5, 12, 4, 263);
    			add_location(br1, file$5, 12, 9, 268);
    			attr_dev(div0, "class", "sector svelte-9t18u6");
    			add_location(div0, file$5, 13, 4, 278);
    			attr_dev(div1, "class", "center");
    			add_location(div1, file$5, 10, 0, 163);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, button);
    			append_dev(div1, t1);
    			append_dev(div1, br0);
    			append_dev(div1, br1);
    			append_dev(div1, t2);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div0, null);
    				}
    			}

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*System, next*/ 3) {
    				each_value = /*System*/ ctx[0].game.sector.steps;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Sector', slots, []);
    	let { System } = $$props;

    	function next(planet) {
    		System.game.jump(planet);
    		System.pages.change("Event");
    	}

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<Sector> was created without expected prop 'System'");
    		}
    	});

    	const writable_props = ['System'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Sector> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		System.pages.change("Menu");
    	};

    	const click_handler_1 = planet => {
    		next(planet);
    	};

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({ System, next });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [System, next, click_handler, click_handler_1];
    }

    class Sector extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { System: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Sector",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get System() {
    		throw new Error("<Sector>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Sector>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Map.svelte generated by Svelte v3.59.2 */

    const file$4 = "src/Map.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (39:62) {:else}
    function create_else_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("???");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(39:62) {:else}",
    		ctx
    	});

    	return block;
    }

    // (39:32) {#if sector.info}
    function create_if_block_3(ctx) {
    	let t_value = /*sector*/ ctx[7].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*System*/ 1 && t_value !== (t_value = /*sector*/ ctx[7].name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(39:32) {#if sector.info}",
    		ctx
    	});

    	return block;
    }

    // (34:53) 
    function create_if_block_2(ctx) {
    	let div;
    	let t_value = /*sector*/ ctx[7].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "visited svelte-rh3dzk");
    			add_location(div, file$4, 34, 32, 1281);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*System*/ 1 && t_value !== (t_value = /*sector*/ ctx[7].name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(34:53) ",
    		ctx
    	});

    	return block;
    }

    // (30:28) {#if sector == System.game.sector}
    function create_if_block_1(ctx) {
    	let div;
    	let t_value = /*sector*/ ctx[7].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "current svelte-rh3dzk");
    			add_location(div, file$4, 30, 32, 1084);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*System*/ 1 && t_value !== (t_value = /*sector*/ ctx[7].name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(30:28) {#if sector == System.game.sector}",
    		ctx
    	});

    	return block;
    }

    // (25:24) {#if (i == System.game.sector.slot + 1) && (System.game.planet.step == System.game.sector.steps.length - 1)}
    function create_if_block(ctx) {
    	let button;
    	let t_value = /*sector*/ ctx[7].name + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[3](/*sector*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "next svelte-rh3dzk");
    			add_location(button, file$4, 25, 28, 819);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_1, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*System*/ 1 && t_value !== (t_value = /*sector*/ ctx[7].name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(25:24) {#if (i == System.game.sector.slot + 1) && (System.game.planet.step == System.game.sector.steps.length - 1)}",
    		ctx
    	});

    	return block;
    }

    // (23:16) {#each stage as sector}
    function create_each_block_1(ctx) {
    	let div;

    	function select_block_type(ctx, dirty) {
    		if (/*i*/ ctx[6] == /*System*/ ctx[0].game.sector.slot + 1 && /*System*/ ctx[0].game.planet.step == /*System*/ ctx[0].game.sector.steps.length - 1) return create_if_block;
    		if (/*sector*/ ctx[7] == /*System*/ ctx[0].game.sector) return create_if_block_1;
    		if (/*sector*/ ctx[7].visited) return create_if_block_2;
    		if (/*sector*/ ctx[7].info) return create_if_block_3;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "sector svelte-rh3dzk");
    			add_location(div, file$4, 23, 20, 637);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(23:16) {#each stage as sector}",
    		ctx
    	});

    	return block;
    }

    // (18:8) {#each System.game.map as stage, i}
    function create_each_block(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let t1_value = /*i*/ ctx[6] + 1 + "";
    	let t1;
    	let t2;
    	let t3;
    	let each_value_1 = /*stage*/ ctx[4];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text("Secteur ");
    			t1 = text(t1_value);
    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t3 = space();
    			add_location(div0, file$4, 19, 16, 514);
    			attr_dev(div1, "class", "stage svelte-rh3dzk");
    			add_location(div1, file$4, 18, 12, 478);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			append_dev(div1, t2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div1, null);
    				}
    			}

    			append_dev(div1, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*next, System*/ 3) {
    				each_value_1 = /*stage*/ ctx[4];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, t3);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(18:8) {#each System.game.map as stage, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div1;
    	let button;
    	let t1;
    	let br;
    	let t2;
    	let div0;
    	let mounted;
    	let dispose;
    	let each_value = /*System*/ ctx[0].game.map;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			button = element("button");
    			button.textContent = "Retour";
    			t1 = space();
    			br = element("br");
    			t2 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(button, file$4, 14, 4, 319);
    			add_location(br, file$4, 15, 4, 394);
    			attr_dev(div0, "class", "map svelte-rh3dzk");
    			add_location(div0, file$4, 16, 4, 404);
    			attr_dev(div1, "class", "center");
    			add_location(div1, file$4, 13, 0, 294);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, button);
    			append_dev(div1, t1);
    			append_dev(div1, br);
    			append_dev(div1, t2);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div0, null);
    				}
    			}

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*System, next*/ 3) {
    				each_value = /*System*/ ctx[0].game.map;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Map', slots, []);
    	let { System } = $$props;

    	function next(sector) {
    		$$invalidate(0, System.game.sector = sector, System);
    		$$invalidate(0, System.game.sector.info = true, System);
    		$$invalidate(0, System.game.sector.visited = true, System);
    		System.game.jump(sector.steps[0][0]);
    		System.pages.change("Menu");
    	}

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<Map> was created without expected prop 'System'");
    		}
    	});

    	const writable_props = ['System'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Map> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		System.pages.change("Menu");
    	};

    	const click_handler_1 = sector => {
    		next(sector);
    	};

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({ System, next });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [System, next, click_handler, click_handler_1];
    }

    let Map$1 = class Map extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { System: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Map",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get System() {
    		throw new Error("<Map>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Map>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    };

    /* src/Event.svelte generated by Svelte v3.59.2 */

    const file$3 = "src/Event.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let switch_instance;
    	let current;
    	var switch_value = /*System*/ ctx[0].game.planet.event.svelte;

    	function switch_props(ctx) {
    		return {
    			props: { System: /*System*/ ctx[0] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div, "class", "center");
    			set_style(div, "text-align", "left");
    			add_location(div, file$3, 5, 0, 55);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (switch_instance) mount_component(switch_instance, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = {};
    			if (dirty & /*System*/ 1) switch_instance_changes.System = /*System*/ ctx[0];

    			if (dirty & /*System*/ 1 && switch_value !== (switch_value = /*System*/ ctx[0].game.planet.event.svelte)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (switch_instance) destroy_component(switch_instance);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Event', slots, []);
    	let { System } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<Event> was created without expected prop 'System'");
    		}
    	});

    	const writable_props = ['System'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Event> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({ System });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [System];
    }

    class Event extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { System: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Event",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get System() {
    		throw new Error("<Event>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Event>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/GameOver.svelte generated by Svelte v3.59.2 */

    const file$2 = "src/GameOver.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let t0;
    	let br0;
    	let br1;
    	let t1;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("Fin du voyage\n    ");
    			br0 = element("br");
    			br1 = element("br");
    			t1 = space();
    			button = element("button");
    			button.textContent = "Retour à l'écran titre";
    			add_location(br0, file$2, 7, 4, 98);
    			add_location(br1, file$2, 7, 9, 103);
    			add_location(button, file$2, 8, 4, 113);
    			attr_dev(div, "class", "center");
    			add_location(div, file$2, 5, 0, 55);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, br0);
    			append_dev(div, br1);
    			append_dev(div, t1);
    			append_dev(div, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[1], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GameOver', slots, []);
    	let { System } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<GameOver> was created without expected prop 'System'");
    		}
    	});

    	const writable_props = ['System'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<GameOver> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		System.pages.change("TitleScreen");
    	};

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({ System });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [System, click_handler];
    }

    class GameOver extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { System: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GameOver",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get System() {
    		throw new Error("<GameOver>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<GameOver>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Victory.svelte generated by Svelte v3.59.2 */

    const file$1 = "src/Victory.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let t0;
    	let br0;
    	let br1;
    	let t1;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("Vous avez triomphé\n    ");
    			br0 = element("br");
    			br1 = element("br");
    			t1 = space();
    			button = element("button");
    			button.textContent = "Retour à l'écran titre";
    			add_location(br0, file$1, 7, 4, 103);
    			add_location(br1, file$1, 7, 9, 108);
    			add_location(button, file$1, 8, 4, 118);
    			attr_dev(div, "class", "center");
    			add_location(div, file$1, 5, 0, 55);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, br0);
    			append_dev(div, br1);
    			append_dev(div, t1);
    			append_dev(div, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[1], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Victory', slots, []);
    	let { System } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<Victory> was created without expected prop 'System'");
    		}
    	});

    	const writable_props = ['System'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Victory> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		System.pages.change("TitleScreen");
    	};

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({ System });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [System, click_handler];
    }

    class Victory extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { System: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Victory",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get System() {
    		throw new Error("<Victory>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Victory>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.59.2 */

    const { Object: Object_1 } = globals;
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let div1;
    	let div0;
    	let switch_instance;
    	let current;
    	var switch_value = /*System*/ ctx[0].pages.actual.svelte;

    	function switch_props(ctx) {
    		return {
    			props: { System: /*System*/ ctx[0] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div0, "id", "body");
    			attr_dev(div0, "class", "svelte-1urvpc0");
    			add_location(div0, file, 200, 1, 5136);
    			attr_dev(div1, "id", "html");
    			attr_dev(div1, "class", "svelte-1urvpc0");
    			add_location(div1, file, 199, 0, 5119);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			if (switch_instance) mount_component(switch_instance, div0, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = {};
    			if (dirty & /*System*/ 1) switch_instance_changes.System = /*System*/ ctx[0];

    			if (dirty & /*System*/ 1 && switch_value !== (switch_value = /*System*/ ctx[0].pages.actual.svelte)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div0, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (switch_instance) destroy_component(switch_instance);
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
    		pages: {
    			actual: {},
    			list: [],
    			add(name, svelte) {
    				System.pages.list.push({ name, svelte });
    			},
    			getByName(name) {
    				for (const page of System.pages.list) {
    					if (page.name == name) {
    						return page;
    					}
    				}
    			},
    			change(name) {
    				$$invalidate(0, System.pages.actual = System.pages.getByName(name), System);
    			}
    		},
    		starters: {
    			class: [],
    			instance: [],
    			getByName(name) {
    				for (let i = 0; i < this.instance.length; i++) {
    					if (this.instance[i].race == name) {
    						return new this.class[i]();
    					}
    				}
    			}
    		},
    		parts: {
    			class: [],
    			instance: [],
    			getByName(name, level) {
    				for (let i = 0; i < this.instance.length; i++) {
    					if (this.instance[i].name == name) {
    						return new this.class[i](level);
    					}
    				}
    			}
    		},
    		races: {
    			class: [],
    			instance: [],
    			getByName(name) {
    				for (let i = 0; i < this.instance.length; i++) {
    					if (this.instance[i].race == name) {
    						return new this.class[i](System);
    					}
    				}
    			}
    		},
    		skills: {
    			class: [],
    			instance: [],
    			getByName(name) {
    				for (let i = 0; i < this.instance.length; i++) {
    					if (this.instance[i].name == name) {
    						return new this.class[i]();
    					}
    				}
    			}
    		},
    		planets: {
    			class: [],
    			instance: [],
    			getByName(name, level, step) {
    				for (let i = 0; i < this.instance.length; i++) {
    					if (this.instance[i].name == name) {
    						this.instance[i].stat++;
    						return new this.class[i](System, level, step);
    					}
    				}
    			}
    		},
    		sectors: {
    			class: [],
    			instance: [],
    			getByName(name, slot) {
    				for (let i = 0; i < this.instance.length; i++) {
    					if (this.instance[i].name == name) {
    						return new this.class[i](System, slot);
    					}
    				}
    			}
    		},
    		events: {
    			class: [],
    			instance: [],
    			getByName(name, level) {
    				for (let i = 0; i < this.instance.length; i++) {
    					if (this.instance[i].name == name) {
    						return new this.class[i](System, level);
    					}
    				}
    			}
    		},
    		game: {}
    	};

    	for (const skill of Object.keys(skills)) {
    		const skillClass = skills[skill];
    		const skillInstance = new skillClass();
    		System.skills.class.push(skillClass);
    		System.skills.instance.push(skillInstance);
    	}

    	for (const race of Object.keys(races)) {
    		const raceClass = races[race];
    		const raceInstance = new raceClass(System);
    		System.races.class.push(raceClass);
    		System.races.instance.push(raceInstance);
    	}

    	for (const part of Object.keys(parts)) {
    		const partClass = parts[part];
    		const partInstance = new partClass();
    		System.parts.class.push(partClass);
    		System.parts.instance.push(partInstance);
    	}

    	for (const starter of Object.keys(starters)) {
    		const starterClass = starters[starter];
    		const starterInstance = new starterClass(System);
    		System.starters.class.push(starterClass);
    		System.starters.instance.push(starterInstance);
    	}

    	for (const planet of Object.keys(planets)) {
    		const planetClass = planets[planet];
    		const planetInstance = new planetClass(System, 1);
    		planetInstance.stat = 0;
    		System.planets.class.push(planetClass);
    		System.planets.instance.push(planetInstance);
    	}

    	for (const sector of Object.keys(sectors)) {
    		const sectorClass = sectors[sector];
    		const sectorInstance = new sectorClass(System, 1);
    		System.sectors.class.push(sectorClass);
    		System.sectors.instance.push(sectorInstance);
    	}

    	for (const event of Object.keys(events)) {
    		const eventClass = events[event];
    		const eventInstance = new eventClass(System, 1);
    		System.events.class.push(eventClass);
    		System.events.instance.push(eventInstance);
    	}
    	System.pages.add("TitleScreen", TitleScreen);
    	System.pages.add("SelectStarter", SelectStarter);
    	System.pages.add("Menu", Menu);
    	System.pages.add("Ship", Ship);
    	System.pages.add("Character", Character);
    	System.pages.add("Part", Part);
    	System.pages.add("Upgrade", Upgrade);
    	System.pages.add("Sector", Sector);
    	System.pages.add("Map", Map$1);
    	System.pages.add("Event", Event);
    	System.pages.add("GameOver", GameOver);
    	System.pages.add("Victory", Victory);
    	System.pages.change("TitleScreen");
    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		System,
    		skills,
    		races,
    		parts,
    		starters,
    		planets,
    		sectors,
    		events,
    		TitleScreen,
    		SelectStarter,
    		Menu,
    		Ship,
    		Character,
    		Part,
    		Upgrade,
    		Sector,
    		Map: Map$1,
    		Event,
    		GameOver,
    		Victory
    	});

    	return [System];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { System: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get System() {
    		return this.$$.ctx[0];
    	}

    	set System(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var app = new App({
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
