
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
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
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

    /* src/Login.svelte generated by Svelte v3.59.2 */

    const file$6 = "src/Login.svelte";

    function create_fragment$6(ctx) {
    	let div1;
    	let div0;
    	let t1;
    	let br0;
    	let br1;
    	let t2;
    	let input;
    	let t3;
    	let br2;
    	let br3;
    	let t4;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "Keylogger";
    			t1 = space();
    			br0 = element("br");
    			br1 = element("br");
    			t2 = space();
    			input = element("input");
    			t3 = space();
    			br2 = element("br");
    			br3 = element("br");
    			t4 = space();
    			button = element("button");
    			button.textContent = "Se connecter";
    			attr_dev(div0, "id", "title");
    			attr_dev(div0, "class", "svelte-1j7m1rb");
    			add_location(div0, file$6, 34, 4, 748);
    			add_location(br0, file$6, 35, 4, 784);
    			add_location(br1, file$6, 35, 9, 789);
    			attr_dev(input, "type", "file");
    			attr_dev(input, "accept", ".txt");
    			attr_dev(input, "class", "svelte-1j7m1rb");
    			add_location(input, file$6, 36, 4, 799);
    			add_location(br2, file$6, 37, 4, 850);
    			add_location(br3, file$6, 37, 9, 855);
    			attr_dev(button, "class", "validate");
    			add_location(button, file$6, 38, 4, 865);
    			attr_dev(div1, "id", "root");
    			attr_dev(div1, "class", "svelte-1j7m1rb");
    			add_location(div1, file$6, 33, 0, 728);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			append_dev(div1, br0);
    			append_dev(div1, br1);
    			append_dev(div1, t2);
    			append_dev(div1, input);
    			append_dev(div1, t3);
    			append_dev(div1, br2);
    			append_dev(div1, br3);
    			append_dev(div1, t4);
    			append_dev(div1, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*input_change_handler*/ ctx[3]),
    					listen_dev(button, "click", /*login*/ ctx[1], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
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
    	validate_slots('Login', slots, []);
    	let { System } = $$props;
    	let files;
    	let save;
    	let step;

    	async function login() {
    		save = await files[0].text();
    		step = 0;
    		$$invalidate(2, System.date = readValue(), System);

    		while (step < save.length) {
    			System.addInput(readValue(), readValue(), readValue(), readValue(), readValue());
    		}

    		for (const data of System.inputs) {
    			System.addKey(data);
    		}

    		System.sortKey();
    		System.changePage(1);
    	}

    	function readValue() {
    		let value = "";

    		while (save[step] != "_" && step < save.length) {
    			value += save[step];
    			step++;
    		}

    		step++;
    		return value;
    	}

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<Login> was created without expected prop 'System'");
    		}
    	});

    	const writable_props = ['System'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	function input_change_handler() {
    		files = this.files;
    		$$invalidate(0, files);
    	}

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(2, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({
    		System,
    		files,
    		save,
    		step,
    		login,
    		readValue
    	});

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(2, System = $$props.System);
    		if ('files' in $$props) $$invalidate(0, files = $$props.files);
    		if ('save' in $$props) save = $$props.save;
    		if ('step' in $$props) step = $$props.step;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [files, login, System, input_change_handler];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { System: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get System() {
    		throw new Error("<Login>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Login>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Menu.svelte generated by Svelte v3.59.2 */

    const file$5 = "src/Menu.svelte";

    function create_fragment$5(ctx) {
    	let t0;
    	let t1_value = /*System*/ ctx[0].date + "";
    	let t1;
    	let t2;
    	let br0;
    	let br1;
    	let t3;
    	let button0;
    	let t5;
    	let button1;
    	let t7;
    	let button2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			t0 = text("Keylog du ");
    			t1 = text(t1_value);
    			t2 = space();
    			br0 = element("br");
    			br1 = element("br");
    			t3 = space();
    			button0 = element("button");
    			button0.textContent = "Historique";
    			t5 = space();
    			button1 = element("button");
    			button1.textContent = "Classement";
    			t7 = space();
    			button2 = element("button");
    			button2.textContent = "Graphique";
    			add_location(br0, file$5, 6, 0, 79);
    			add_location(br1, file$5, 6, 5, 84);
    			add_location(button0, file$5, 7, 0, 90);
    			add_location(button1, file$5, 7, 68, 158);
    			add_location(button2, file$5, 7, 136, 226);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, button1, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, button2, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[1], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[2], false, false, false, false),
    					listen_dev(button2, "click", /*click_handler_2*/ ctx[3], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*System*/ 1 && t1_value !== (t1_value = /*System*/ ctx[0].date + "")) set_data_dev(t1, t1_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(button1);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(button2);
    			mounted = false;
    			run_all(dispose);
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
    		System.changePage(1);
    	};

    	const click_handler_1 = () => {
    		System.changePage(2);
    	};

    	const click_handler_2 = () => {
    		System.changePage(4);
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

    	return [System, click_handler, click_handler_1, click_handler_2];
    }

    class Menu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { System: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Menu",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get System() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Historic.svelte generated by Svelte v3.59.2 */
    const file$4 = "src/Historic.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	child_ctx[4] = i;
    	return child_ctx;
    }

    // (11:8) {#if index != 0}
    function create_if_block$2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "row-border svelte-1h3i7dz");
    			add_location(div, file$4, 11, 12, 314);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(11:8) {#if index != 0}",
    		ctx
    	});

    	return block;
    }

    // (9:0) {#each System.inputs as input, index}
    function create_each_block$3(ctx) {
    	let div2;
    	let t0;
    	let div0;
    	let t1_value = /*input*/ ctx[2].name + "";
    	let t1;
    	let t2;
    	let div1;
    	let t3_value = /*input*/ ctx[2].hour + "";
    	let t3;
    	let t4;
    	let t5_value = /*input*/ ctx[2].minute + "";
    	let t5;
    	let t6;
    	let t7_value = /*input*/ ctx[2].second + "";
    	let t7;
    	let t8;
    	let t9_value = /*input*/ ctx[2].micro + "";
    	let t9;
    	let t10;
    	let mounted;
    	let dispose;
    	let if_block = /*index*/ ctx[4] != 0 && create_if_block$2(ctx);

    	function click_handler() {
    		return /*click_handler*/ ctx[1](/*input*/ ctx[2]);
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			div0 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			div1 = element("div");
    			t3 = text(t3_value);
    			t4 = text("h ");
    			t5 = text(t5_value);
    			t6 = text("m ");
    			t7 = text(t7_value);
    			t8 = text("s ");
    			t9 = text(t9_value);
    			t10 = text("ms");
    			add_location(div0, file$4, 13, 8, 367);
    			add_location(div1, file$4, 16, 8, 421);
    			attr_dev(div2, "class", "container svelte-1h3i7dz");
    			add_location(div2, file$4, 9, 4, 183);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			if (if_block) if_block.m(div2, null);
    			append_dev(div2, t0);
    			append_dev(div2, div0);
    			append_dev(div0, t1);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, t3);
    			append_dev(div1, t4);
    			append_dev(div1, t5);
    			append_dev(div1, t6);
    			append_dev(div1, t7);
    			append_dev(div1, t8);
    			append_dev(div1, t9);
    			append_dev(div1, t10);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div2, "click", click_handler, false, false, false, false),
    					listen_dev(div2, "keypress", keypress_handler$1, false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*System*/ 1 && t1_value !== (t1_value = /*input*/ ctx[2].name + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*System*/ 1 && t3_value !== (t3_value = /*input*/ ctx[2].hour + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*System*/ 1 && t5_value !== (t5_value = /*input*/ ctx[2].minute + "")) set_data_dev(t5, t5_value);
    			if (dirty & /*System*/ 1 && t7_value !== (t7_value = /*input*/ ctx[2].second + "")) set_data_dev(t7, t7_value);
    			if (dirty & /*System*/ 1 && t9_value !== (t9_value = /*input*/ ctx[2].micro + "")) set_data_dev(t9, t9_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(9:0) {#each System.inputs as input, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let switch_instance;
    	let t0;
    	let br0;
    	let t1;
    	let t2;
    	let br1;
    	let current;
    	var switch_value = Menu;

    	function switch_props(ctx) {
    		return {
    			props: { System: /*System*/ ctx[0] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	let each_value = /*System*/ ctx[0].inputs;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			t0 = space();
    			br0 = element("br");
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			br1 = element("br");
    			add_location(br0, file$4, 7, 0, 135);
    			add_location(br1, file$4, 21, 0, 535);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, t1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, t2, anchor);
    			insert_dev(target, br1, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = {};
    			if (dirty & /*System*/ 1) switch_instance_changes.System = /*System*/ ctx[0];

    			if (switch_value !== (switch_value = Menu)) {
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
    					mount_component(switch_instance, t0.parentNode, t0);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}

    			if (dirty & /*System*/ 1) {
    				each_value = /*System*/ ctx[0].inputs;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t2.parentNode, t2);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
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
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(t1);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(br1);
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

    const keypress_handler$1 = () => {
    	
    };

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Historic', slots, []);
    	let { System } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<Historic> was created without expected prop 'System'");
    		}
    	});

    	const writable_props = ['System'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Historic> was created with unknown prop '${key}'`);
    	});

    	const click_handler = input => {
    		System.seeKeyFromData(input);
    	};

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({ Menu, System });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [System, click_handler];
    }

    class Historic extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { System: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Historic",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get System() {
    		throw new Error("<Historic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Historic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Visualise.svelte generated by Svelte v3.59.2 */
    const file$3 = "src/Visualise.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	child_ctx[4] = i;
    	return child_ctx;
    }

    // (10:8) {#if index != 0}
    function create_if_block$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "row-border svelte-1h3i7dz");
    			add_location(div, file$3, 10, 12, 295);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(10:8) {#if index != 0}",
    		ctx
    	});

    	return block;
    }

    // (8:0) {#each System.keys as key, index}
    function create_each_block$2(ctx) {
    	let div2;
    	let t0;
    	let div0;
    	let t1_value = /*key*/ ctx[2].name + "";
    	let t1;
    	let t2;
    	let div1;
    	let t3_value = /*key*/ ctx[2].inputs + "";
    	let t3;
    	let mounted;
    	let dispose;
    	let if_block = /*index*/ ctx[4] != 0 && create_if_block$1(ctx);

    	function click_handler() {
    		return /*click_handler*/ ctx[1](/*key*/ ctx[2]);
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			div0 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			div1 = element("div");
    			t3 = text(t3_value);
    			add_location(div0, file$3, 12, 8, 348);
    			add_location(div1, file$3, 15, 8, 400);
    			attr_dev(div2, "class", "container svelte-1h3i7dz");
    			add_location(div2, file$3, 8, 4, 173);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			if (if_block) if_block.m(div2, null);
    			append_dev(div2, t0);
    			append_dev(div2, div0);
    			append_dev(div0, t1);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, t3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div2, "click", click_handler, false, false, false, false),
    					listen_dev(div2, "keypress", keypress_handler, false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*System*/ 1 && t1_value !== (t1_value = /*key*/ ctx[2].name + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*System*/ 1 && t3_value !== (t3_value = /*key*/ ctx[2].inputs + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(8:0) {#each System.keys as key, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let switch_instance;
    	let t0;
    	let t1;
    	let br;
    	let current;
    	var switch_value = Menu;

    	function switch_props(ctx) {
    		return {
    			props: { System: /*System*/ ctx[0] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	let each_value = /*System*/ ctx[0].keys;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			t0 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			br = element("br");
    			add_location(br, file$3, 20, 0, 465);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, t0, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, t1, anchor);
    			insert_dev(target, br, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = {};
    			if (dirty & /*System*/ 1) switch_instance_changes.System = /*System*/ ctx[0];

    			if (switch_value !== (switch_value = Menu)) {
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
    					mount_component(switch_instance, t0.parentNode, t0);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}

    			if (dirty & /*System*/ 1) {
    				each_value = /*System*/ ctx[0].keys;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t1.parentNode, t1);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
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
    			if (detaching) detach_dev(t0);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(br);
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

    const keypress_handler = () => {
    	
    };

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Visualise', slots, []);
    	let { System } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<Visualise> was created without expected prop 'System'");
    		}
    	});

    	const writable_props = ['System'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Visualise> was created with unknown prop '${key}'`);
    	});

    	const click_handler = key => {
    		System.seeKey(key);
    	};

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({ Menu, System });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [System, click_handler];
    }

    class Visualise extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { System: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Visualise",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get System() {
    		throw new Error("<Visualise>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Visualise>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Key.svelte generated by Svelte v3.59.2 */
    const file$2 = "src/Key.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	child_ctx[4] = i;
    	return child_ctx;
    }

    // (19:4) {#if index != 0}
    function create_if_block(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "row-border svelte-1p0qfzy");
    			add_location(div, file$2, 19, 8, 413);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(19:4) {#if index != 0}",
    		ctx
    	});

    	return block;
    }

    // (18:0) {#each array as input, index}
    function create_each_block$1(ctx) {
    	let t0;
    	let div;
    	let t1_value = /*input*/ ctx[2].hour + "";
    	let t1;
    	let t2;
    	let t3_value = /*input*/ ctx[2].minute + "";
    	let t3;
    	let t4;
    	let t5_value = /*input*/ ctx[2].second + "";
    	let t5;
    	let t6;
    	let t7_value = /*input*/ ctx[2].micro + "";
    	let t7;
    	let t8;
    	let if_block = /*index*/ ctx[4] != 0 && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();
    			div = element("div");
    			t1 = text(t1_value);
    			t2 = text("h ");
    			t3 = text(t3_value);
    			t4 = text("m ");
    			t5 = text(t5_value);
    			t6 = text("s ");
    			t7 = text(t7_value);
    			t8 = text("ms");
    			attr_dev(div, "class", "container svelte-1p0qfzy");
    			add_location(div, file$2, 21, 4, 458);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, t1);
    			append_dev(div, t2);
    			append_dev(div, t3);
    			append_dev(div, t4);
    			append_dev(div, t5);
    			append_dev(div, t6);
    			append_dev(div, t7);
    			append_dev(div, t8);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(18:0) {#each array as input, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let switch_instance;
    	let t0;
    	let br0;
    	let t1;
    	let t2_value = /*System*/ ctx[0].see.name + "";
    	let t2;
    	let t3;
    	let t4_value = /*System*/ ctx[0].see.inputs + "";
    	let t4;
    	let t5;
    	let br1;
    	let br2;
    	let t6;
    	let t7;
    	let br3;
    	let current;
    	var switch_value = Menu;

    	function switch_props(ctx) {
    		return {
    			props: { System: /*System*/ ctx[0] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	let each_value = /*array*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			t0 = space();
    			br0 = element("br");
    			t1 = space();
    			t2 = text(t2_value);
    			t3 = text(" : ");
    			t4 = text(t4_value);
    			t5 = text(" appuies\n");
    			br1 = element("br");
    			br2 = element("br");
    			t6 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t7 = space();
    			br3 = element("br");
    			add_location(br0, file$2, 14, 0, 289);
    			add_location(br1, file$2, 16, 0, 343);
    			add_location(br2, file$2, 16, 5, 348);
    			add_location(br3, file$2, 25, 0, 571);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, br2, anchor);
    			insert_dev(target, t6, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, t7, anchor);
    			insert_dev(target, br3, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = {};
    			if (dirty & /*System*/ 1) switch_instance_changes.System = /*System*/ ctx[0];

    			if (switch_value !== (switch_value = Menu)) {
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
    					mount_component(switch_instance, t0.parentNode, t0);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}

    			if ((!current || dirty & /*System*/ 1) && t2_value !== (t2_value = /*System*/ ctx[0].see.name + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty & /*System*/ 1) && t4_value !== (t4_value = /*System*/ ctx[0].see.inputs + "")) set_data_dev(t4, t4_value);

    			if (dirty & /*array*/ 2) {
    				each_value = /*array*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t7.parentNode, t7);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
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
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(br2);
    			if (detaching) detach_dev(t6);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(br3);
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
    	validate_slots('Key', slots, []);
    	let { System } = $$props;
    	let array = [];

    	for (const input of System.inputs) {
    		if (input.name == System.see.name) {
    			array.push(input);
    		}
    	}

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<Key> was created without expected prop 'System'");
    		}
    	});

    	const writable_props = ['System'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Key> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({ Menu, System, array });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    		if ('array' in $$props) $$invalidate(1, array = $$props.array);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [System, array];
    }

    class Key extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { System: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Key",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get System() {
    		throw new Error("<Key>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Key>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Graphic.svelte generated by Svelte v3.59.2 */
    const file$1 = "src/Graphic.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	child_ctx[4] = i;
    	return child_ctx;
    }

    // (15:8) {#each System.keys as point, i}
    function create_each_block(ctx) {
    	let rect;
    	let rect_height_value;
    	let rect_y_value;
    	let text0;
    	let t0_value = /*point*/ ctx[2].name + "";
    	let t0;
    	let text1;
    	let t1_value = /*point*/ ctx[2].inputs + "";
    	let t1;

    	const block = {
    		c: function create() {
    			rect = svg_element("rect");
    			text0 = svg_element("text");
    			t0 = text(t0_value);
    			text1 = svg_element("text");
    			t1 = text(t1_value);
    			attr_dev(rect, "width", barWidth);
    			attr_dev(rect, "height", rect_height_value = /*point*/ ctx[2].inputs * (400 / /*max*/ ctx[1]));
    			attr_dev(rect, "x", 10 + /*i*/ ctx[4] * barWidth);
    			attr_dev(rect, "y", rect_y_value = 10 + height - 100 - /*point*/ ctx[2].inputs * (400 / /*max*/ ctx[1]));
    			attr_dev(rect, "fill", "rgb(30,144,255)");
    			attr_dev(rect, "stroke", "#000");
    			add_location(rect, file$1, 15, 12, 387);
    			attr_dev(text0, "x", 10 + /*i*/ ctx[4] * barWidth);
    			attr_dev(text0, "y", "460");
    			attr_dev(text0, "fill", "black");
    			add_location(text0, file$1, 23, 12, 680);
    			attr_dev(text1, "x", 10 + /*i*/ ctx[4] * barWidth);
    			attr_dev(text1, "y", "480");
    			attr_dev(text1, "fill", "black");
    			add_location(text1, file$1, 28, 12, 824);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, rect, anchor);
    			insert_dev(target, text0, anchor);
    			append_dev(text0, t0);
    			insert_dev(target, text1, anchor);
    			append_dev(text1, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*System*/ 1 && rect_height_value !== (rect_height_value = /*point*/ ctx[2].inputs * (400 / /*max*/ ctx[1]))) {
    				attr_dev(rect, "height", rect_height_value);
    			}

    			if (dirty & /*System*/ 1 && rect_y_value !== (rect_y_value = 10 + height - 100 - /*point*/ ctx[2].inputs * (400 / /*max*/ ctx[1]))) {
    				attr_dev(rect, "y", rect_y_value);
    			}

    			if (dirty & /*System*/ 1 && t0_value !== (t0_value = /*point*/ ctx[2].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*System*/ 1 && t1_value !== (t1_value = /*point*/ ctx[2].inputs + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(rect);
    			if (detaching) detach_dev(text0);
    			if (detaching) detach_dev(text1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(15:8) {#each System.keys as point, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let switch_instance;
    	let t0;
    	let br;
    	let t1;
    	let div;
    	let svg;
    	let current;
    	var switch_value = Menu;

    	function switch_props(ctx) {
    		return {
    			props: { System: /*System*/ ctx[0] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	let each_value = /*System*/ ctx[0].keys;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			t0 = space();
    			br = element("br");
    			t1 = space();
    			div = element("div");
    			svg = svg_element("svg");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(br, file$1, 11, 0, 221);
    			set_style(svg, "width", 20 + barWidth * /*System*/ ctx[0].keys.length + "px");
    			set_style(svg, "height", 10 + height + "px");
    			attr_dev(svg, "class", "svelte-w0yfm1");
    			add_location(svg, file$1, 13, 4, 252);
    			attr_dev(div, "id", "container");
    			attr_dev(div, "class", "svelte-w0yfm1");
    			add_location(div, file$1, 12, 0, 227);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, br, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(svg, null);
    				}
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = {};
    			if (dirty & /*System*/ 1) switch_instance_changes.System = /*System*/ ctx[0];

    			if (switch_value !== (switch_value = Menu)) {
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
    					mount_component(switch_instance, t0.parentNode, t0);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}

    			if (dirty & /*barWidth, System, max, height*/ 3) {
    				each_value = /*System*/ ctx[0].keys;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(svg, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (!current || dirty & /*System*/ 1) {
    				set_style(svg, "width", 20 + barWidth * /*System*/ ctx[0].keys.length + "px");
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
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
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

    const barWidth = 50;
    const height = 500;

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Graphic', slots, []);
    	let { System } = $$props;
    	const max = System.keys[0].inputs;

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<Graphic> was created without expected prop 'System'");
    		}
    	});

    	const writable_props = ['System'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Graphic> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({ Menu, System, barWidth, height, max });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [System, max];
    }

    class Graphic extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { System: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Graphic",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get System() {
    		throw new Error("<Graphic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.59.2 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let div;
    	let switch_instance;
    	let current;
    	var switch_value = /*System*/ ctx[0].pages[/*System*/ ctx[0].page];

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
    			attr_dev(div, "id", "root");
    			attr_dev(div, "class", "svelte-1w5lx4y");
    			add_location(div, file, 69, 0, 1382);
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

    			if (dirty & /*System*/ 1 && switch_value !== (switch_value = /*System*/ ctx[0].pages[/*System*/ ctx[0].page])) {
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
    		pages: [Login, Historic, Visualise, Key, Graphic],
    		page: 0,
    		changePage(newPage) {
    			$$invalidate(0, System.page = newPage, System);
    		},
    		date: "",
    		totalInput: 0,
    		inputs: [],
    		keys: [],
    		see: {},
    		checkKey(key) {
    			for (const k of System.keys) {
    				if (k.name == key.name) {
    					return k;
    				}
    			}

    			return undefined;
    		},
    		sortKey() {
    			for (let i = 1; i < System.keys.length; i++) {
    				let j = i;

    				while (j > 0 && System.keys[j].inputs > System.keys[j - 1].inputs) {
    					let temp = System.keys[j - 1];
    					$$invalidate(0, System.keys[j - 1] = System.keys[j], System);
    					$$invalidate(0, System.keys[j] = temp, System);
    					j--;
    				}
    			}
    		},
    		addKey(key) {
    			let k = System.checkKey(key);

    			if (k == undefined) {
    				System.keys.push({ name: key.name, inputs: 1 });
    			} else {
    				k.inputs++;
    			}

    			$$invalidate(0, System.totalInput++, System);
    		},
    		seeKey(key) {
    			$$invalidate(0, System.see = key, System);
    			System.changePage(3);
    		},
    		seeKeyFromData(key) {
    			System.seeKey(System.checkKey(key));
    		},
    		addInput(name, hour, minute, second, micro) {
    			System.inputs.push({ name, hour, minute, second, micro });
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Login,
    		Historic,
    		Visualise,
    		Key,
    		Graphic,
    		System
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
