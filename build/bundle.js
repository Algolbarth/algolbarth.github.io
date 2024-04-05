
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
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
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

    let App$1 = class App {
        text = "";
        dateStart = Date.now();
        dateEnd = Date.now();
        version = "1.0";
        technos = [];
        categories = [];
        github = undefined;
        web = false;
    };

    /* src/Apps/Navigator/Description.svelte generated by Svelte v3.59.2 */

    function create_fragment$g(ctx) {
    	let t_value = /*app*/ ctx[0].text + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*app*/ 1 && t_value !== (t_value = /*app*/ ctx[0].text + "")) set_data_dev(t, t_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
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
    	validate_slots('Description', slots, []);
    	let { System } = $$props;
    	let { app } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<Description> was created without expected prop 'System'");
    		}

    		if (app === undefined && !('app' in $$props || $$self.$$.bound[$$self.$$.props['app']])) {
    			console.warn("<Description> was created without expected prop 'app'");
    		}
    	});

    	const writable_props = ['System', 'app'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Description> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(1, System = $$props.System);
    		if ('app' in $$props) $$invalidate(0, app = $$props.app);
    	};

    	$$self.$capture_state = () => ({ System, app });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(1, System = $$props.System);
    		if ('app' in $$props) $$invalidate(0, app = $$props.app);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [app, System];
    }

    let Description$8 = class Description extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { System: 1, app: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Description",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get System() {
    		throw new Error("<Description>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Description>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get app() {
    		throw new Error("<Description>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set app(value) {
    		throw new Error("<Description>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    };

    class Navigator extends App$1{
        name = "Navigator";
        text = "Gestionnaire de favori basé sur la gestion de fichier de linux. Permets de sauvegarder un fichier contenant vos favoris, classer ces derniers dans des dossiers.";
        description = Description$8;
        technos = ["Javascript", "Svelte"];
        categories = ["Personnel"];
        dateStart = new Date(2021, 1);
        dateEnd = new Date(2023, 1);
        version = "2.0";
        github = "https://github.com/Algolbarth/Navigator";
        web = true;
    }

    /* src/Apps/FutureQuest/Description.svelte generated by Svelte v3.59.2 */

    function create_fragment$f(ctx) {
    	let t_value = /*app*/ ctx[0].text + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*app*/ 1 && t_value !== (t_value = /*app*/ ctx[0].text + "")) set_data_dev(t, t_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
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
    	validate_slots('Description', slots, []);
    	let { System } = $$props;
    	let { app } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<Description> was created without expected prop 'System'");
    		}

    		if (app === undefined && !('app' in $$props || $$self.$$.bound[$$self.$$.props['app']])) {
    			console.warn("<Description> was created without expected prop 'app'");
    		}
    	});

    	const writable_props = ['System', 'app'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Description> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(1, System = $$props.System);
    		if ('app' in $$props) $$invalidate(0, app = $$props.app);
    	};

    	$$self.$capture_state = () => ({ System, app });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(1, System = $$props.System);
    		if ('app' in $$props) $$invalidate(0, app = $$props.app);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [app, System];
    }

    let Description$7 = class Description extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { System: 1, app: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Description",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get System() {
    		throw new Error("<Description>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Description>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get app() {
    		throw new Error("<Description>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set app(value) {
    		throw new Error("<Description>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    };

    class FutureQuest extends App$1 {
        name = "Future Quest";
        text = "Jeu rogue-like minimaliste où l'on gère un vaisseau et son équipage. Progressez en ajoutant des modules à votre vaisseau, recrutant des nouveaux membres, affrontant des pirates.";
        description = Description$7;
        technos = ["Javascript", "Svelte"];
        categories = ["Jeux"];
        dateStart = new Date(2023, 9);
        dateEnd = new Date(2023, 11);
        github = "https://github.com/Algolbarth/Future-Quest";
        web = true;
    }

    /* src/Apps/Plateform/Description.svelte generated by Svelte v3.59.2 */

    function create_fragment$e(ctx) {
    	let t_value = /*app*/ ctx[0].text + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*app*/ 1 && t_value !== (t_value = /*app*/ ctx[0].text + "")) set_data_dev(t, t_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
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
    	validate_slots('Description', slots, []);
    	let { System } = $$props;
    	let { app } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<Description> was created without expected prop 'System'");
    		}

    		if (app === undefined && !('app' in $$props || $$self.$$.bound[$$self.$$.props['app']])) {
    			console.warn("<Description> was created without expected prop 'app'");
    		}
    	});

    	const writable_props = ['System', 'app'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Description> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(1, System = $$props.System);
    		if ('app' in $$props) $$invalidate(0, app = $$props.app);
    	};

    	$$self.$capture_state = () => ({ System, app });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(1, System = $$props.System);
    		if ('app' in $$props) $$invalidate(0, app = $$props.app);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [app, System];
    }

    let Description$6 = class Description extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { System: 1, app: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Description",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get System() {
    		throw new Error("<Description>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Description>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get app() {
    		throw new Error("<Description>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set app(value) {
    		throw new Error("<Description>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    };

    class Plateform extends App$1 {
        name = "Plateform";
        text = "Petit jeu de plateforme réalisé en javascript. Reprend le premier niveau de New Super Mario Bros sur DS.";
        description = Description$6;
        technos = ["Javascript", "Svelte"];
        categories = ["Jeux", "Interface graphique"];
        dateStart = new Date(2023, 4);
        dateEnd = new Date(2023, 10);
        version = "1.2";
        github = "https://github.com/Algolbarth/Plateform";
        web = true;
    }

    /* src/Apps/Keylogger/Description.svelte generated by Svelte v3.59.2 */

    function create_fragment$d(ctx) {
    	let t_value = /*app*/ ctx[0].text + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*app*/ 1 && t_value !== (t_value = /*app*/ ctx[0].text + "")) set_data_dev(t, t_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
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
    	validate_slots('Description', slots, []);
    	let { System } = $$props;
    	let { app } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<Description> was created without expected prop 'System'");
    		}

    		if (app === undefined && !('app' in $$props || $$self.$$.bound[$$self.$$.props['app']])) {
    			console.warn("<Description> was created without expected prop 'app'");
    		}
    	});

    	const writable_props = ['System', 'app'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Description> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(1, System = $$props.System);
    		if ('app' in $$props) $$invalidate(0, app = $$props.app);
    	};

    	$$self.$capture_state = () => ({ System, app });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(1, System = $$props.System);
    		if ('app' in $$props) $$invalidate(0, app = $$props.app);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [app, System];
    }

    let Description$5 = class Description extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { System: 1, app: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Description",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get System() {
    		throw new Error("<Description>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Description>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get app() {
    		throw new Error("<Description>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set app(value) {
    		throw new Error("<Description>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    };

    class Keylogger extends App$1 {
        name = "Keylogger";
        text = "Interface web pour visualiser ses inputs de touche. Un script python permet de récupérer toutes les informations envoyées par votre clavier, qui sont stockées dans un fichier log. Ce fichier peut être ensuite lu via le keylogger pour connaitre vos stats et informations.";
        description = Description$5;
        technos = ["Javascript", "Svelte", "Python"];
        categories = ["Personnel"];
        dateStart = new Date(2023, 1);
        dateEnd = new Date(2023, 1);
        github = "https://github.com/Algolbarth/Keylogger";
        web = true;
    }

    /* src/Apps/Dimension/Description.svelte generated by Svelte v3.59.2 */

    function create_fragment$c(ctx) {
    	let t_value = /*app*/ ctx[0].text + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*app*/ 1 && t_value !== (t_value = /*app*/ ctx[0].text + "")) set_data_dev(t, t_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
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
    	validate_slots('Description', slots, []);
    	let { System } = $$props;
    	let { app } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<Description> was created without expected prop 'System'");
    		}

    		if (app === undefined && !('app' in $$props || $$self.$$.bound[$$self.$$.props['app']])) {
    			console.warn("<Description> was created without expected prop 'app'");
    		}
    	});

    	const writable_props = ['System', 'app'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Description> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(1, System = $$props.System);
    		if ('app' in $$props) $$invalidate(0, app = $$props.app);
    	};

    	$$self.$capture_state = () => ({ System, app });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(1, System = $$props.System);
    		if ('app' in $$props) $$invalidate(0, app = $$props.app);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [app, System];
    }

    let Description$4 = class Description extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { System: 1, app: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Description",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get System() {
    		throw new Error("<Description>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Description>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get app() {
    		throw new Error("<Description>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set app(value) {
    		throw new Error("<Description>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    };

    class Dimension extends App$1 {
        name = "Dimension the Game";
        text = "Fan game en hommage à la communauté du serveur discord Dimension. Basé sur Reigns, il vous demandera de réagir à des messages et private jokes des membres du discord. À vous de gérer vos ressources (mental, réputation, etc.) pour survire à Dimension.";
        description = Description$4;
        technos = ["Javascript"];
        categories = ["Jeux"];
        dateStart = new Date(2021, 11);
        dateEnd = new Date(2022, 11);
        version = "1.1";
        github = "https://github.com/Algolbarth/Dimension-The-Game";
        web = true;
    }

    /* src/Apps/Cryptage/Description.svelte generated by Svelte v3.59.2 */

    function create_fragment$b(ctx) {
    	let t_value = /*app*/ ctx[0].text + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*app*/ 1 && t_value !== (t_value = /*app*/ ctx[0].text + "")) set_data_dev(t, t_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
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
    	validate_slots('Description', slots, []);
    	let { System } = $$props;
    	let { app } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<Description> was created without expected prop 'System'");
    		}

    		if (app === undefined && !('app' in $$props || $$self.$$.bound[$$self.$$.props['app']])) {
    			console.warn("<Description> was created without expected prop 'app'");
    		}
    	});

    	const writable_props = ['System', 'app'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Description> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(1, System = $$props.System);
    		if ('app' in $$props) $$invalidate(0, app = $$props.app);
    	};

    	$$self.$capture_state = () => ({ System, app });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(1, System = $$props.System);
    		if ('app' in $$props) $$invalidate(0, app = $$props.app);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [app, System];
    }

    let Description$3 = class Description extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { System: 1, app: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Description",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get System() {
    		throw new Error("<Description>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Description>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get app() {
    		throw new Error("<Description>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set app(value) {
    		throw new Error("<Description>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    };

    class Cryptage extends App$1 {
        name = "Cryptage";
        text = "Interface web de cryptage/décryptage César et Vigenère.";
        description = Description$3;
        technos = ["Javascript"];
        categories = ["Scolaire"];
        dateStart = new Date(2022, 4);
        dateEnd = new Date(2022, 4);
        github = "https://github.com/Algolbarth/Cryptage";
        web = true;
    }

    /* src/Apps/Asteroids/Description.svelte generated by Svelte v3.59.2 */

    function create_fragment$a(ctx) {
    	let t_value = /*app*/ ctx[0].text + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*app*/ 1 && t_value !== (t_value = /*app*/ ctx[0].text + "")) set_data_dev(t, t_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
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
    	validate_slots('Description', slots, []);
    	let { System } = $$props;
    	let { app } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<Description> was created without expected prop 'System'");
    		}

    		if (app === undefined && !('app' in $$props || $$self.$$.bound[$$self.$$.props['app']])) {
    			console.warn("<Description> was created without expected prop 'app'");
    		}
    	});

    	const writable_props = ['System', 'app'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Description> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(1, System = $$props.System);
    		if ('app' in $$props) $$invalidate(0, app = $$props.app);
    	};

    	$$self.$capture_state = () => ({ System, app });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(1, System = $$props.System);
    		if ('app' in $$props) $$invalidate(0, app = $$props.app);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [app, System];
    }

    let Description$2 = class Description extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { System: 1, app: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Description",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get System() {
    		throw new Error("<Description>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Description>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get app() {
    		throw new Error("<Description>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set app(value) {
    		throw new Error("<Description>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    };

    class Asteroids extends App$1 {
        name = "Asteroids";
        text = "Jeu réalisé en C++ à l'aide de QT. Basé sur le célèbre jeu d'arcade Asteroids.";
        description = Description$2;
        technos = ["C++", "QT"];
        categories = ["Jeux", "Scolaire", "Interface graphique"];
        dateStart = new Date(2021, 1);
        dateEnd = new Date(2021, 5);
        github = "https://github.com/Algolbarth/Asteroids-QT";
    }

    /* src/Apps/Graph/Description.svelte generated by Svelte v3.59.2 */

    function create_fragment$9(ctx) {
    	let t_value = /*app*/ ctx[0].text + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*app*/ 1 && t_value !== (t_value = /*app*/ ctx[0].text + "")) set_data_dev(t, t_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
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
    	validate_slots('Description', slots, []);
    	let { System } = $$props;
    	let { app } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<Description> was created without expected prop 'System'");
    		}

    		if (app === undefined && !('app' in $$props || $$self.$$.bound[$$self.$$.props['app']])) {
    			console.warn("<Description> was created without expected prop 'app'");
    		}
    	});

    	const writable_props = ['System', 'app'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Description> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(1, System = $$props.System);
    		if ('app' in $$props) $$invalidate(0, app = $$props.app);
    	};

    	$$self.$capture_state = () => ({ System, app });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(1, System = $$props.System);
    		if ('app' in $$props) $$invalidate(0, app = $$props.app);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [app, System];
    }

    let Description$1 = class Description extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { System: 1, app: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Description",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get System() {
    		throw new Error("<Description>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Description>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get app() {
    		throw new Error("<Description>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set app(value) {
    		throw new Error("<Description>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    };

    class Graph extends App$1 {
        name = "Graph";
        text = "Projet scolaire qui s'intéressait aux problèmes NP-complet. En groupe de 5 nous devions concevoir quatre algorithmes afin de résoudre plus ou efficacement un problème de voyageur de commerce. Ces algorithmes se basait sur la théorie des graphes, une branche des mathématiques utilisant des points reliés par des arcs afin de modéliser une situation.";
        description = Description$1;
        technos = ["C++"];
        categories = ["Scolaire"];
        dateStart = new Date(2022, 11);
        dateEnd = new Date(2023, 4);
        github = "https://github.com/Algolbarth/Projet-graph";
    }

    /* src/Apps/JsRPG/Description.svelte generated by Svelte v3.59.2 */

    function create_fragment$8(ctx) {
    	let t_value = /*app*/ ctx[0].text + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*app*/ 1 && t_value !== (t_value = /*app*/ ctx[0].text + "")) set_data_dev(t, t_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
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
    	validate_slots('Description', slots, []);
    	let { System } = $$props;
    	let { app } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<Description> was created without expected prop 'System'");
    		}

    		if (app === undefined && !('app' in $$props || $$self.$$.bound[$$self.$$.props['app']])) {
    			console.warn("<Description> was created without expected prop 'app'");
    		}
    	});

    	const writable_props = ['System', 'app'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Description> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(1, System = $$props.System);
    		if ('app' in $$props) $$invalidate(0, app = $$props.app);
    	};

    	$$self.$capture_state = () => ({ System, app });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(1, System = $$props.System);
    		if ('app' in $$props) $$invalidate(0, app = $$props.app);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [app, System];
    }

    class Description extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { System: 1, app: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Description",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get System() {
    		throw new Error("<Description>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Description>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get app() {
    		throw new Error("<Description>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set app(value) {
    		throw new Error("<Description>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    class JsRPG extends App$1 {
        name = "JsRPG";
        text = "Jeu rogue like s'inspirant de mécaniques de jeux de cartes à jouer. Il est à ce jour mon plus gros projet ainsi que celui qui m'a accompagné tout au long de mes études sur mon temps personnel. J'ai pu développer mes compétences en applications web en cherchant des solutions sur ce projet, m'amenant sans cesse à revoir mes méthodes de travail (d'où le grand nombre de versions).";
        description = Description;
        technos = ["Javascript", "Svelte"];
        categories = ["Jeux"];
        dateStart = new Date(2020, 1);
        dateEnd = new Date(2024, 11);
        version = "3.0";
        github = "https://github.com/Algolbarth/JsRPG";
        web = true;
    }

    var apps = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Asteroids: Asteroids,
        Cryptage: Cryptage,
        Dimension: Dimension,
        FutureQuest: FutureQuest,
        Graph: Graph,
        JsRPG: JsRPG,
        Keylogger: Keylogger,
        Navigator: Navigator,
        Plateform: Plateform
    });

    /* src/View.svelte generated by Svelte v3.59.2 */

    const file$6 = "src/View.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    // (27:4) {#if app.github != undefined}
    function create_if_block_2(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Dépôt Github";
    			attr_dev(button, "class", "transparent github svelte-1rjdabl");
    			add_location(button, file$6, 27, 8, 647);
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
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(27:4) {#if app.github != undefined}",
    		ctx
    	});

    	return block;
    }

    // (35:4) {#if app.web}
    function create_if_block_1$2(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Voir sur navigateur";
    			attr_dev(button, "class", "transparent web svelte-1rjdabl");
    			add_location(button, file$6, 35, 8, 857);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_2*/ ctx[4], false, false, false, false);
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
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(35:4) {#if app.web}",
    		ctx
    	});

    	return block;
    }

    // (51:12) {#if i > 0}
    function create_if_block$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(",");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(51:12) {#if i > 0}",
    		ctx
    	});

    	return block;
    }

    // (50:8) {#each app.categories as category, i}
    function create_each_block_1(ctx) {
    	let t0;
    	let t1_value = /*category*/ ctx[9] + "";
    	let t1;
    	let if_block = /*i*/ ctx[11] > 0 && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();
    			t1 = text(t1_value);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*app*/ 2 && t1_value !== (t1_value = /*category*/ ctx[9] + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(50:8) {#each app.categories as category, i}",
    		ctx
    	});

    	return block;
    }

    // (58:8) {#each app.technos as techno}
    function create_each_block$2(ctx) {
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let mounted;
    	let dispose;

    	function click_handler_3() {
    		return /*click_handler_3*/ ctx[5](/*techno*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "./Pictures/" + /*techno*/ ctx[6] + ".png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*techno*/ ctx[6]);
    			attr_dev(img, "class", "svelte-1rjdabl");
    			add_location(img, file$6, 58, 12, 1434);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(img, "keydown", keydown_handler, false, false, false, false),
    					listen_dev(img, "click", click_handler_3, false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*app*/ 2 && !src_url_equal(img.src, img_src_value = "./Pictures/" + /*techno*/ ctx[6] + ".png")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*app*/ 2 && img_alt_value !== (img_alt_value = /*techno*/ ctx[6])) {
    				attr_dev(img, "alt", img_alt_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(58:8) {#each app.technos as techno}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div5;
    	let div3;
    	let div1;
    	let div0;
    	let t0_value = /*app*/ ctx[1].name + "";
    	let t0;
    	let t1;
    	let t2_value = /*app*/ ctx[1].version + "";
    	let t2;
    	let t3;
    	let div2;
    	let button;
    	let t5;
    	let t6;
    	let t7;
    	let hr0;
    	let t8;
    	let switch_instance;
    	let t9;
    	let div4;
    	let t10;
    	let t11;
    	let hr1;
    	let t12;
    	let br;
    	let t13;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*app*/ ctx[1].github != undefined && create_if_block_2(ctx);
    	let if_block1 = /*app*/ ctx[1].web && create_if_block_1$2(ctx);
    	var switch_value = /*app*/ ctx[1].description;

    	function switch_props(ctx) {
    		return {
    			props: {
    				System: /*System*/ ctx[0],
    				app: /*app*/ ctx[1]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	let each_value_1 = /*app*/ ctx[1].categories;
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*app*/ ctx[1].technos;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div3 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = text("\n            v");
    			t2 = text(t2_value);
    			t3 = space();
    			div2 = element("div");
    			button = element("button");
    			button.textContent = "X";
    			t5 = space();
    			if (if_block0) if_block0.c();
    			t6 = space();
    			if (if_block1) if_block1.c();
    			t7 = space();
    			hr0 = element("hr");
    			t8 = space();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			t9 = space();
    			div4 = element("div");
    			t10 = text("Mots clés :\n        ");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t11 = space();
    			hr1 = element("hr");
    			t12 = space();
    			br = element("br");
    			t13 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_style(div0, "display", "inline-block");
    			set_style(div0, "font-size", "xx-large");
    			add_location(div0, file$6, 8, 12, 133);
    			add_location(div1, file$6, 7, 8, 115);
    			attr_dev(button, "class", "close svelte-1rjdabl");
    			add_location(button, file$6, 14, 12, 326);
    			set_style(div2, "text-align", "right");
    			add_location(div2, file$6, 13, 8, 283);
    			attr_dev(div3, "class", "container svelte-1rjdabl");
    			add_location(div3, file$6, 6, 4, 83);
    			add_location(hr0, file$6, 43, 4, 1095);
    			add_location(hr1, file$6, 55, 8, 1362);
    			add_location(br, file$6, 56, 8, 1377);
    			attr_dev(div4, "id", "footer");
    			attr_dev(div4, "class", "svelte-1rjdabl");
    			add_location(div4, file$6, 47, 4, 1171);
    			attr_dev(div5, "id", "body");
    			attr_dev(div5, "class", "svelte-1rjdabl");
    			add_location(div5, file$6, 5, 0, 63);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div3);
    			append_dev(div3, div1);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div1, t1);
    			append_dev(div1, t2);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			append_dev(div2, button);
    			append_dev(div5, t5);
    			if (if_block0) if_block0.m(div5, null);
    			append_dev(div5, t6);
    			if (if_block1) if_block1.m(div5, null);
    			append_dev(div5, t7);
    			append_dev(div5, hr0);
    			append_dev(div5, t8);
    			if (switch_instance) mount_component(switch_instance, div5, null);
    			append_dev(div5, t9);
    			append_dev(div5, div4);
    			append_dev(div4, t10);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				if (each_blocks_1[i]) {
    					each_blocks_1[i].m(div4, null);
    				}
    			}

    			append_dev(div4, t11);
    			append_dev(div4, hr1);
    			append_dev(div4, t12);
    			append_dev(div4, br);
    			append_dev(div4, t13);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div4, null);
    				}
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*app*/ 2) && t0_value !== (t0_value = /*app*/ ctx[1].name + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty & /*app*/ 2) && t2_value !== (t2_value = /*app*/ ctx[1].version + "")) set_data_dev(t2, t2_value);

    			if (/*app*/ ctx[1].github != undefined) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					if_block0.m(div5, t6);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*app*/ ctx[1].web) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$2(ctx);
    					if_block1.c();
    					if_block1.m(div5, t7);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			const switch_instance_changes = {};
    			if (dirty & /*System*/ 1) switch_instance_changes.System = /*System*/ ctx[0];
    			if (dirty & /*app*/ 2) switch_instance_changes.app = /*app*/ ctx[1];

    			if (dirty & /*app*/ 2 && switch_value !== (switch_value = /*app*/ ctx[1].description)) {
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
    					mount_component(switch_instance, div5, t9);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}

    			if (dirty & /*app*/ 2) {
    				each_value_1 = /*app*/ ctx[1].categories;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div4, t11);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*app, window, System*/ 3) {
    				each_value = /*app*/ ctx[1].technos;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div4, null);
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
    			if (detaching) detach_dev(div5);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (switch_instance) destroy_component(switch_instance);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
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

    const keydown_handler = () => {
    	
    };

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('View', slots, []);
    	let { System } = $$props;
    	let { app } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<View> was created without expected prop 'System'");
    		}

    		if (app === undefined && !('app' in $$props || $$self.$$.bound[$$self.$$.props['app']])) {
    			console.warn("<View> was created without expected prop 'app'");
    		}
    	});

    	const writable_props = ['System', 'app'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<View> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		$$invalidate(0, System.projects.view = undefined, System);
    		System.pages.change("Projects");
    	};

    	const click_handler_1 = () => {
    		window.location.href = app.github;
    	};

    	const click_handler_2 = () => {
    		window.location.href = "algolbarth.github.io/Apps/" + app.name + "/index.html";
    	};

    	const click_handler_3 = techno => window.open(System.technos.getByName(techno).link);

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    		if ('app' in $$props) $$invalidate(1, app = $$props.app);
    	};

    	$$self.$capture_state = () => ({ System, app });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    		if ('app' in $$props) $$invalidate(1, app = $$props.app);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [System, app, click_handler, click_handler_1, click_handler_2, click_handler_3];
    }

    class View extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { System: 0, app: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "View",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get System() {
    		throw new Error("<View>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<View>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get app() {
    		throw new Error("<View>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set app(value) {
    		throw new Error("<View>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Dropdown.svelte generated by Svelte v3.59.2 */

    const file$5 = "src/Dropdown.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    // (40:4) {:else}
    function create_else_block$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Liste");
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
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(40:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (38:4) {#if selected != undefined}
    function create_if_block_1$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*selected*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*selected*/ 1) set_data_dev(t, /*selected*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(38:4) {#if selected != undefined}",
    		ctx
    	});

    	return block;
    }

    // (45:2) {#if isDropdownOpen}
    function create_if_block$3(ctx) {
    	let div;
    	let each_value = /*array*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "list scroll svelte-g52a64");
    			set_style(div, "width", /*width*/ ctx[3] + "vw");
    			set_style(div, "max-height", /*height*/ ctx[2] + "vh");
    			add_location(div, file$5, 45, 3, 882);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div, null);
    				}
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*select, array*/ 130) {
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
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*width*/ 8) {
    				set_style(div, "width", /*width*/ ctx[3] + "vw");
    			}

    			if (dirty & /*height*/ 4) {
    				set_style(div, "max-height", /*height*/ ctx[2] + "vh");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(45:2) {#if isDropdownOpen}",
    		ctx
    	});

    	return block;
    }

    // (51:4) {#each array as element}
    function create_each_block$1(ctx) {
    	let button;
    	let t0_value = /*element*/ ctx[10] + "";
    	let t0;
    	let t1;
    	let br;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[9](/*element*/ ctx[10]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			br = element("br");
    			attr_dev(button, "class", "svelte-g52a64");
    			add_location(button, file$5, 51, 5, 1018);
    			add_location(br, file$5, 56, 5, 1113);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, br, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*array*/ 2 && t0_value !== (t0_value = /*element*/ ctx[10] + "")) set_data_dev(t0, t0_value);
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
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(51:4) {#each array as element}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let button;
    	let t;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*selected*/ ctx[0] != undefined) return create_if_block_1$1;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*isDropdownOpen*/ ctx[4] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			button = element("button");
    			if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			attr_dev(button, "class", "main svelte-g52a64");
    			set_style(button, "width", /*width*/ ctx[3] + "vw");
    			add_location(button, file$5, 32, 3, 657);
    			add_location(div0, file$5, 31, 2, 648);
    			add_location(div1, file$5, 30, 1, 602);
    			set_style(div2, "height", "3vh");
    			add_location(div2, file$5, 29, 0, 575);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, button);
    			if_block0.m(button, null);
    			append_dev(div1, t);
    			if (if_block1) if_block1.m(div1, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*handleDropdownClick*/ ctx[5], false, false, false, false),
    					listen_dev(div1, "focusout", /*handleDropdownFocusLoss*/ ctx[6], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(button, null);
    				}
    			}

    			if (dirty & /*width*/ 8) {
    				set_style(button, "width", /*width*/ ctx[3] + "vw");
    			}

    			if (/*isDropdownOpen*/ ctx[4]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$3(ctx);
    					if_block1.c();
    					if_block1.m(div1, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if_block0.d();
    			if (if_block1) if_block1.d();
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
    	validate_slots('Dropdown', slots, []);
    	let { array = [] } = $$props;
    	let { selected } = $$props;

    	let { selecting = function () {
    		
    	} } = $$props;

    	let { height = 25 } = $$props;
    	let { width = 15 } = $$props;
    	let isDropdownOpen = false;

    	const handleDropdownClick = () => {
    		$$invalidate(4, isDropdownOpen = !isDropdownOpen);
    	};

    	const handleDropdownFocusLoss = ({ relatedTarget, currentTarget }) => {
    		if (relatedTarget instanceof HTMLElement && currentTarget.contains(relatedTarget)) return;
    		$$invalidate(4, isDropdownOpen = false);
    	};

    	function select(element) {
    		selecting(element);
    		$$invalidate(0, selected = element);
    		$$invalidate(4, isDropdownOpen = false);
    	}

    	$$self.$$.on_mount.push(function () {
    		if (selected === undefined && !('selected' in $$props || $$self.$$.bound[$$self.$$.props['selected']])) {
    			console.warn("<Dropdown> was created without expected prop 'selected'");
    		}
    	});

    	const writable_props = ['array', 'selected', 'selecting', 'height', 'width'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dropdown> was created with unknown prop '${key}'`);
    	});

    	const click_handler = element => {
    		select(element);
    	};

    	$$self.$$set = $$props => {
    		if ('array' in $$props) $$invalidate(1, array = $$props.array);
    		if ('selected' in $$props) $$invalidate(0, selected = $$props.selected);
    		if ('selecting' in $$props) $$invalidate(8, selecting = $$props.selecting);
    		if ('height' in $$props) $$invalidate(2, height = $$props.height);
    		if ('width' in $$props) $$invalidate(3, width = $$props.width);
    	};

    	$$self.$capture_state = () => ({
    		array,
    		selected,
    		selecting,
    		height,
    		width,
    		isDropdownOpen,
    		handleDropdownClick,
    		handleDropdownFocusLoss,
    		select
    	});

    	$$self.$inject_state = $$props => {
    		if ('array' in $$props) $$invalidate(1, array = $$props.array);
    		if ('selected' in $$props) $$invalidate(0, selected = $$props.selected);
    		if ('selecting' in $$props) $$invalidate(8, selecting = $$props.selecting);
    		if ('height' in $$props) $$invalidate(2, height = $$props.height);
    		if ('width' in $$props) $$invalidate(3, width = $$props.width);
    		if ('isDropdownOpen' in $$props) $$invalidate(4, isDropdownOpen = $$props.isDropdownOpen);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		selected,
    		array,
    		height,
    		width,
    		isDropdownOpen,
    		handleDropdownClick,
    		handleDropdownFocusLoss,
    		select,
    		selecting,
    		click_handler
    	];
    }

    class Dropdown extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			array: 1,
    			selected: 0,
    			selecting: 8,
    			height: 2,
    			width: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dropdown",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get array() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set array(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selecting() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selecting(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.59.2 */

    const file$4 = "src/App.svelte";

    // (25:20) {:else}
    function create_else_block$1(ctx) {
    	let t0_value = /*app*/ ctx[1].dateStart.getUTCFullYear() + "";
    	let t0;
    	let t1;
    	let t2_value = /*app*/ ctx[1].dateEnd.getUTCFullYear() + "";
    	let t2;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = text(" - ");
    			t2 = text(t2_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*app*/ 2 && t0_value !== (t0_value = /*app*/ ctx[1].dateStart.getUTCFullYear() + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*app*/ 2 && t2_value !== (t2_value = /*app*/ ctx[1].dateEnd.getUTCFullYear() + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(25:20) {:else}",
    		ctx
    	});

    	return block;
    }

    // (23:20) {#if app.dateEnd.getUTCFullYear() == app.dateStart.getUTCFullYear()}
    function create_if_block$2(ctx) {
    	let t_value = /*app*/ ctx[1].dateEnd.getUTCFullYear() + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*app*/ 2 && t_value !== (t_value = /*app*/ ctx[1].dateEnd.getUTCFullYear() + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(23:20) {#if app.dateEnd.getUTCFullYear() == app.dateStart.getUTCFullYear()}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div6;
    	let button;
    	let div5;
    	let div3;
    	let div1;
    	let div0;
    	let t0_value = /*app*/ ctx[1].name + "";
    	let t0;
    	let t1;
    	let t2_value = /*app*/ ctx[1].version + "";
    	let t2;
    	let t3;
    	let div2;
    	let show_if;
    	let t4;
    	let hr;
    	let t5;
    	let div4;
    	let t6_value = /*app*/ ctx[1].text + "";
    	let t6;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (dirty & /*app*/ 2) show_if = null;
    		if (show_if == null) show_if = !!(/*app*/ ctx[1].dateEnd.getUTCFullYear() == /*app*/ ctx[1].dateStart.getUTCFullYear());
    		if (show_if) return create_if_block$2;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx, -1);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			button = element("button");
    			div5 = element("div");
    			div3 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = text("\n                    v");
    			t2 = text(t2_value);
    			t3 = space();
    			div2 = element("div");
    			if_block.c();
    			t4 = space();
    			hr = element("hr");
    			t5 = space();
    			div4 = element("div");
    			t6 = text(t6_value);
    			attr_dev(div0, "class", "name svelte-1003fko");
    			add_location(div0, file$4, 16, 20, 357);
    			add_location(div1, file$4, 15, 16, 331);
    			attr_dev(div2, "class", "version svelte-1003fko");
    			add_location(div2, file$4, 21, 16, 512);
    			attr_dev(div3, "id", "container");
    			attr_dev(div3, "class", "svelte-1003fko");
    			add_location(div3, file$4, 14, 12, 294);
    			attr_dev(hr, "class", "svelte-1003fko");
    			add_location(hr, file$4, 29, 12, 876);
    			attr_dev(div4, "class", "text svelte-1003fko");
    			add_location(div4, file$4, 30, 12, 895);
    			attr_dev(div5, "class", "" + (null_to_empty("content") + " svelte-1003fko"));
    			add_location(div5, file$4, 13, 8, 258);
    			attr_dev(button, "class", "transparent svelte-1003fko");
    			add_location(button, file$4, 6, 4, 86);
    			attr_dev(div6, "class", "main svelte-1003fko");
    			add_location(div6, file$4, 5, 0, 63);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, button);
    			append_dev(button, div5);
    			append_dev(div5, div3);
    			append_dev(div3, div1);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div1, t1);
    			append_dev(div1, t2);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			if_block.m(div2, null);
    			append_dev(div5, t4);
    			append_dev(div5, hr);
    			append_dev(div5, t5);
    			append_dev(div5, div4);
    			append_dev(div4, t6);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*app*/ 2 && t0_value !== (t0_value = /*app*/ ctx[1].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*app*/ 2 && t2_value !== (t2_value = /*app*/ ctx[1].version + "")) set_data_dev(t2, t2_value);

    			if (current_block_type === (current_block_type = select_block_type(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div2, null);
    				}
    			}

    			if (dirty & /*app*/ 2 && t6_value !== (t6_value = /*app*/ ctx[1].text + "")) set_data_dev(t6, t6_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			if_block.d();
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
    	validate_slots('App', slots, []);
    	let { System } = $$props;
    	let { app } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<App> was created without expected prop 'System'");
    		}

    		if (app === undefined && !('app' in $$props || $$self.$$.bound[$$self.$$.props['app']])) {
    			console.warn("<App> was created without expected prop 'app'");
    		}
    	});

    	const writable_props = ['System', 'app'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		$$invalidate(0, System.projects.view = app, System);
    		System.pages.change("Projects");
    	};

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    		if ('app' in $$props) $$invalidate(1, app = $$props.app);
    	};

    	$$self.$capture_state = () => ({ System, app });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    		if ('app' in $$props) $$invalidate(1, app = $$props.app);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [System, app, click_handler];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { System: 0, app: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get System() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get app() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set app(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Projects.svelte generated by Svelte v3.59.2 */
    const file$3 = "src/Projects.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    // (76:0) {:else}
    function create_else_block(ctx) {
    	let div7;
    	let div0;
    	let t0_value = /*appList*/ ctx[1].length + "";
    	let t0;
    	let t1;
    	let t2;
    	let div2;
    	let div1;
    	let t4;
    	let switch_instance0;
    	let t5;
    	let div4;
    	let div3;
    	let t7;
    	let switch_instance1;
    	let t8;
    	let div6;
    	let div5;
    	let t10;
    	let switch_instance2;
    	let t11;
    	let div9;
    	let br0;
    	let t12;
    	let br1;
    	let t13;
    	let br2;
    	let t14;
    	let br3;
    	let t15;
    	let div8;
    	let t16;
    	let br4;
    	let t17;
    	let br5;
    	let t18;
    	let br6;
    	let t19;
    	let br7;
    	let current;
    	let if_block = /*appList*/ ctx[1].length > 1 && create_if_block_1(ctx);
    	var switch_value = Dropdown;

    	function switch_props(ctx) {
    		return {
    			props: {
    				array: ["Nom", "Date de début", "Date de fin"],
    				selected: /*sortType*/ ctx[2],
    				selecting: /*func*/ ctx[8]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance0 = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	var switch_value_1 = Dropdown;

    	function switch_props_1(ctx) {
    		return {
    			props: {
    				array: /*categoryList*/ ctx[6],
    				selected: /*categorySelected*/ ctx[4],
    				selecting: /*func_1*/ ctx[9]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value_1) {
    		switch_instance1 = construct_svelte_component_dev(switch_value_1, switch_props_1(ctx));
    	}

    	var switch_value_2 = Dropdown;

    	function switch_props_2(ctx) {
    		return {
    			props: {
    				array: /*technoList*/ ctx[5],
    				selected: /*technoSelected*/ ctx[3],
    				selecting: /*func_2*/ ctx[10]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value_2) {
    		switch_instance2 = construct_svelte_component_dev(switch_value_2, switch_props_2(ctx));
    	}

    	let each_value = /*appList*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = text(" projet");
    			if (if_block) if_block.c();
    			t2 = space();
    			div2 = element("div");
    			div1 = element("div");
    			div1.textContent = "Trier par";
    			t4 = space();
    			if (switch_instance0) create_component(switch_instance0.$$.fragment);
    			t5 = space();
    			div4 = element("div");
    			div3 = element("div");
    			div3.textContent = "Catégories";
    			t7 = space();
    			if (switch_instance1) create_component(switch_instance1.$$.fragment);
    			t8 = space();
    			div6 = element("div");
    			div5 = element("div");
    			div5.textContent = "Langages";
    			t10 = space();
    			if (switch_instance2) create_component(switch_instance2.$$.fragment);
    			t11 = space();
    			div9 = element("div");
    			br0 = element("br");
    			t12 = space();
    			br1 = element("br");
    			t13 = space();
    			br2 = element("br");
    			t14 = space();
    			br3 = element("br");
    			t15 = space();
    			div8 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t16 = space();
    			br4 = element("br");
    			t17 = space();
    			br5 = element("br");
    			t18 = space();
    			br6 = element("br");
    			t19 = space();
    			br7 = element("br");
    			attr_dev(div0, "class", "label svelte-9b9tm2");
    			add_location(div0, file$3, 77, 8, 2199);
    			attr_dev(div1, "class", "label svelte-9b9tm2");
    			add_location(div1, file$3, 82, 12, 2337);
    			attr_dev(div2, "id", "drop");
    			attr_dev(div2, "class", "svelte-9b9tm2");
    			add_location(div2, file$3, 81, 8, 2309);
    			attr_dev(div3, "class", "label svelte-9b9tm2");
    			add_location(div3, file$3, 95, 12, 2738);
    			attr_dev(div4, "id", "drop");
    			attr_dev(div4, "class", "svelte-9b9tm2");
    			add_location(div4, file$3, 94, 8, 2710);
    			attr_dev(div5, "class", "label svelte-9b9tm2");
    			add_location(div5, file$3, 108, 12, 3129);
    			attr_dev(div6, "id", "drop");
    			attr_dev(div6, "class", "svelte-9b9tm2");
    			add_location(div6, file$3, 107, 8, 3101);
    			attr_dev(div7, "id", "header");
    			attr_dev(div7, "class", "svelte-9b9tm2");
    			add_location(div7, file$3, 76, 4, 2173);
    			add_location(br0, file$3, 121, 8, 3514);
    			add_location(br1, file$3, 122, 8, 3529);
    			add_location(br2, file$3, 123, 8, 3544);
    			add_location(br3, file$3, 124, 8, 3559);
    			attr_dev(div8, "id", "container");
    			attr_dev(div8, "class", "svelte-9b9tm2");
    			add_location(div8, file$3, 125, 8, 3574);
    			add_location(br4, file$3, 130, 8, 3736);
    			add_location(br5, file$3, 131, 8, 3751);
    			add_location(br6, file$3, 132, 8, 3766);
    			add_location(br7, file$3, 133, 8, 3781);
    			attr_dev(div9, "id", "body");
    			attr_dev(div9, "class", "svelte-9b9tm2");
    			add_location(div9, file$3, 120, 4, 3490);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div0);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			if (if_block) if_block.m(div0, null);
    			append_dev(div7, t2);
    			append_dev(div7, div2);
    			append_dev(div2, div1);
    			append_dev(div2, t4);
    			if (switch_instance0) mount_component(switch_instance0, div2, null);
    			append_dev(div7, t5);
    			append_dev(div7, div4);
    			append_dev(div4, div3);
    			append_dev(div4, t7);
    			if (switch_instance1) mount_component(switch_instance1, div4, null);
    			append_dev(div7, t8);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div6, t10);
    			if (switch_instance2) mount_component(switch_instance2, div6, null);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, div9, anchor);
    			append_dev(div9, br0);
    			append_dev(div9, t12);
    			append_dev(div9, br1);
    			append_dev(div9, t13);
    			append_dev(div9, br2);
    			append_dev(div9, t14);
    			append_dev(div9, br3);
    			append_dev(div9, t15);
    			append_dev(div9, div8);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div8, null);
    				}
    			}

    			append_dev(div9, t16);
    			append_dev(div9, br4);
    			append_dev(div9, t17);
    			append_dev(div9, br5);
    			append_dev(div9, t18);
    			append_dev(div9, br6);
    			append_dev(div9, t19);
    			append_dev(div9, br7);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*appList*/ 2) && t0_value !== (t0_value = /*appList*/ ctx[1].length + "")) set_data_dev(t0, t0_value);

    			if (/*appList*/ ctx[1].length > 1) {
    				if (if_block) ; else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			const switch_instance0_changes = {};
    			if (dirty & /*sortType*/ 4) switch_instance0_changes.selected = /*sortType*/ ctx[2];
    			if (dirty & /*sortType*/ 4) switch_instance0_changes.selecting = /*func*/ ctx[8];

    			if (switch_value !== (switch_value = Dropdown)) {
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
    					mount_component(switch_instance0, div2, null);
    				} else {
    					switch_instance0 = null;
    				}
    			} else if (switch_value) {
    				switch_instance0.$set(switch_instance0_changes);
    			}

    			const switch_instance1_changes = {};
    			if (dirty & /*categorySelected*/ 16) switch_instance1_changes.selected = /*categorySelected*/ ctx[4];
    			if (dirty & /*categorySelected*/ 16) switch_instance1_changes.selecting = /*func_1*/ ctx[9];

    			if (switch_value_1 !== (switch_value_1 = Dropdown)) {
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
    			if (dirty & /*technoSelected*/ 8) switch_instance2_changes.selected = /*technoSelected*/ ctx[3];
    			if (dirty & /*technoSelected*/ 8) switch_instance2_changes.selecting = /*func_2*/ ctx[10];

    			if (switch_value_2 !== (switch_value_2 = Dropdown)) {
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
    					mount_component(switch_instance2, div6, null);
    				} else {
    					switch_instance2 = null;
    				}
    			} else if (switch_value_2) {
    				switch_instance2.$set(switch_instance2_changes);
    			}

    			if (dirty & /*App, System, appList*/ 3) {
    				each_value = /*appList*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div8, null);
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
    			if (switch_instance0) transition_in(switch_instance0.$$.fragment, local);
    			if (switch_instance1) transition_in(switch_instance1.$$.fragment, local);
    			if (switch_instance2) transition_in(switch_instance2.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance0) transition_out(switch_instance0.$$.fragment, local);
    			if (switch_instance1) transition_out(switch_instance1.$$.fragment, local);
    			if (switch_instance2) transition_out(switch_instance2.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			if (if_block) if_block.d();
    			if (switch_instance0) destroy_component(switch_instance0);
    			if (switch_instance1) destroy_component(switch_instance1);
    			if (switch_instance2) destroy_component(switch_instance2);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(div9);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(76:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (72:0) {#if System.projects.view != undefined}
    function create_if_block$1(ctx) {
    	let div;
    	let switch_instance;
    	let current;
    	var switch_value = View;

    	function switch_props(ctx) {
    		return {
    			props: {
    				System: /*System*/ ctx[0],
    				app: /*System*/ ctx[0].projects.view
    			},
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
    			attr_dev(div, "id", "view");
    			attr_dev(div, "class", "svelte-9b9tm2");
    			add_location(div, file$3, 72, 4, 2057);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (switch_instance) mount_component(switch_instance, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*System*/ 1) switch_instance_changes.System = /*System*/ ctx[0];
    			if (dirty & /*System*/ 1) switch_instance_changes.app = /*System*/ ctx[0].projects.view;

    			if (switch_value !== (switch_value = View)) {
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
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(72:0) {#if System.projects.view != undefined}",
    		ctx
    	});

    	return block;
    }

    // (79:35) {#if appList.length > 1}
    function create_if_block_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("s");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(79:35) {#if appList.length > 1}",
    		ctx
    	});

    	return block;
    }

    // (127:12) {#each appList as app}
    function create_each_block(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = App;

    	function switch_props(ctx) {
    		return {
    			props: {
    				System: /*System*/ ctx[0],
    				app: /*app*/ ctx[12]
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
    			if (dirty & /*System*/ 1) switch_instance_changes.System = /*System*/ ctx[0];
    			if (dirty & /*appList*/ 2) switch_instance_changes.app = /*app*/ ctx[12];

    			if (switch_value !== (switch_value = App)) {
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
    		id: create_each_block.name,
    		type: "each",
    		source: "(127:12) {#each appList as app}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*System*/ ctx[0].projects.view != undefined) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
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
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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
    	validate_slots('Projects', slots, []);
    	let { System } = $$props;
    	let appList = [];
    	let sortType = "Nom";
    	let technoList = ["Tous"];

    	for (const techno of System.technos.list) {
    		technoList.push(techno.name);
    	}

    	let technoSelected = technoList[0];
    	let categoryList = ["Toutes"];

    	for (const category of System.categories.list) {
    		categoryList.push(category);
    	}

    	let categorySelected = categoryList[0];

    	function filter() {
    		let array = [];

    		for (const project of System.projects.list) {
    			if ((categorySelected == "Toutes" || project.categories.includes(categorySelected)) && (technoSelected == "Tous" || project.technos.includes(technoSelected))) {
    				array.push(project);
    			}
    		}

    		array = sort(array);
    		$$invalidate(1, appList = array);
    	}

    	function sort(array) {
    		switch (sortType) {
    			case "Date de début":
    				for (let i = 0; i < array.length; i++) {
    					let j = i;

    					while (j > 0 && array[j].dateStart < array[j - 1].dateStart) {
    						let swap = array[j - 1];
    						array[j - 1] = array[j];
    						array[j] = swap;
    						j--;
    					}
    				}
    				break;
    			case "Date de fin":
    				for (let i = 0; i < array.length; i++) {
    					let j = i;

    					while (j > 0 && array[j].dateEnd < array[j - 1].dateEnd) {
    						let swap = array[j - 1];
    						array[j - 1] = array[j];
    						array[j] = swap;
    						j--;
    					}
    				}
    				break;
    		}

    		return array;
    	}

    	filter();

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<Projects> was created without expected prop 'System'");
    		}
    	});

    	const writable_props = ['System'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Projects> was created with unknown prop '${key}'`);
    	});

    	const func = function (element) {
    		$$invalidate(2, sortType = element);
    		filter();
    	};

    	const func_1 = function (element) {
    		$$invalidate(4, categorySelected = element);
    		filter();
    	};

    	const func_2 = function (element) {
    		$$invalidate(3, technoSelected = element);
    		filter();
    	};

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({
    		View,
    		Dropdown,
    		App,
    		System,
    		appList,
    		sortType,
    		technoList,
    		technoSelected,
    		categoryList,
    		categorySelected,
    		filter,
    		sort
    	});

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    		if ('appList' in $$props) $$invalidate(1, appList = $$props.appList);
    		if ('sortType' in $$props) $$invalidate(2, sortType = $$props.sortType);
    		if ('technoList' in $$props) $$invalidate(5, technoList = $$props.technoList);
    		if ('technoSelected' in $$props) $$invalidate(3, technoSelected = $$props.technoSelected);
    		if ('categoryList' in $$props) $$invalidate(6, categoryList = $$props.categoryList);
    		if ('categorySelected' in $$props) $$invalidate(4, categorySelected = $$props.categorySelected);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		System,
    		appList,
    		sortType,
    		technoSelected,
    		categorySelected,
    		technoList,
    		categoryList,
    		filter,
    		func,
    		func_1,
    		func_2
    	];
    }

    class Projects extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { System: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Projects",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get System() {
    		throw new Error("<Projects>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Projects>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Presentation.svelte generated by Svelte v3.59.2 */

    function create_fragment$3(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
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

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Presentation', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Presentation> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Presentation extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Presentation",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/Contacts.svelte generated by Svelte v3.59.2 */

    const file$2 = "src/Contacts.svelte";

    function create_fragment$2(ctx) {
    	let button0;
    	let div1;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let div0;
    	let t2;
    	let br0;
    	let t3;
    	let button1;
    	let div3;
    	let img1;
    	let img1_src_value;
    	let t4;
    	let div2;
    	let t6;
    	let br1;
    	let br2;
    	let t7;
    	let div7;
    	let div4;
    	let t9;
    	let div6;
    	let img2;
    	let img2_src_value;
    	let t10;
    	let div5;
    	let a;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button0 = element("button");
    			div1 = element("div");
    			img0 = element("img");
    			t0 = space();
    			div0 = element("div");
    			div0.textContent = "Github";
    			t2 = space();
    			br0 = element("br");
    			t3 = space();
    			button1 = element("button");
    			div3 = element("div");
    			img1 = element("img");
    			t4 = space();
    			div2 = element("div");
    			div2.textContent = "Linkedin";
    			t6 = space();
    			br1 = element("br");
    			br2 = element("br");
    			t7 = space();
    			div7 = element("div");
    			div4 = element("div");
    			div4.textContent = "Vous pouvez envoyer un mail à :";
    			t9 = space();
    			div6 = element("div");
    			img2 = element("img");
    			t10 = space();
    			div5 = element("div");
    			a = element("a");
    			a.textContent = "paul.poirier@live.fr";
    			if (!src_url_equal(img0.src, img0_src_value = "Pictures/Github.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "icon");
    			set_style(img0, "display", "inline");
    			set_style(img0, "height", "3vh");
    			add_location(img0, file$2, 7, 8, 148);
    			set_style(div0, "display", "inline");
    			add_location(div0, file$2, 12, 8, 280);
    			add_location(div1, file$2, 6, 4, 134);
    			attr_dev(button0, "class", "github account svelte-1umu64v");
    			add_location(button0, file$2, 0, 0, 0);
    			add_location(br0, file$2, 15, 0, 343);
    			if (!src_url_equal(img1.src, img1_src_value = "Pictures/Linkedin.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "icon");
    			set_style(img1, "display", "inline");
    			set_style(img1, "height", "3vh");
    			add_location(img1, file$2, 23, 8, 533);
    			set_style(div2, "display", "inline");
    			add_location(div2, file$2, 28, 8, 667);
    			add_location(div3, file$2, 22, 5, 519);
    			attr_dev(button1, "class", "linkedin account svelte-1umu64v");
    			add_location(button1, file$2, 16, 0, 350);
    			add_location(br1, file$2, 32, 0, 733);
    			add_location(br2, file$2, 32, 5, 738);
    			set_style(div4, "transform", "translate(0, 25%)");
    			add_location(div4, file$2, 35, 4, 776);
    			if (!src_url_equal(img2.src, img2_src_value = "Pictures/Mail.svg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "mail");
    			attr_dev(img2, "class", "icon svelte-1umu64v");
    			add_location(img2, file$2, 39, 8, 907);
    			attr_dev(a, "href", "mailto:paul.poirier@live.fr");
    			attr_dev(a, "class", "svelte-1umu64v");
    			add_location(a, file$2, 41, 12, 989);
    			add_location(div5, file$2, 40, 8, 971);
    			attr_dev(div6, "class", "container svelte-1umu64v");
    			add_location(div6, file$2, 38, 4, 875);
    			set_style(div7, "display", "flex");
    			add_location(div7, file$2, 34, 0, 745);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button0, anchor);
    			append_dev(button0, div1);
    			append_dev(div1, img0);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, button1, anchor);
    			append_dev(button1, div3);
    			append_dev(div3, img1);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, br2, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div4);
    			append_dev(div7, t9);
    			append_dev(div7, div6);
    			append_dev(div6, img2);
    			append_dev(div6, t10);
    			append_dev(div6, div5);
    			append_dev(div5, a);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[0], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[1], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(button1);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(br2);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(div7);
    			mounted = false;
    			run_all(dispose);
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

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Contacts', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Contacts> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		window.location.href = "https://github.com/Algolbarth";
    	};

    	const click_handler_1 = () => {
    		window.location.href = "https://www.linkedin.com/in/paul-poirier-612b48264/";
    	};

    	return [click_handler, click_handler_1];
    }

    class Contacts extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contacts",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/Taskbar.svelte generated by Svelte v3.59.2 */

    const file$1 = "src/Taskbar.svelte";

    function create_fragment$1(ctx) {
    	let div4;
    	let div0;
    	let t1;
    	let div1;
    	let button0;
    	let t3;
    	let div2;
    	let button1;
    	let t5;
    	let div3;
    	let button2;
    	let t7;
    	let div5;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			div0.textContent = "Algolbarth";
    			t1 = space();
    			div1 = element("div");
    			button0 = element("button");
    			button0.textContent = "Projets";
    			t3 = space();
    			div2 = element("div");
    			button1 = element("button");
    			button1.textContent = "Présentation";
    			t5 = space();
    			div3 = element("div");
    			button2 = element("button");
    			button2.textContent = "Contacts";
    			t7 = space();
    			div5 = element("div");
    			set_style(div0, "transform", "translate(0,25%)");
    			set_style(div0, "font-size", "xx-large");
    			add_location(div0, file$1, 5, 4, 81);
    			attr_dev(button0, "class", "menu transparent svelte-17l0p4d");
    			add_location(button0, file$1, 7, 8, 176);
    			add_location(div1, file$1, 6, 4, 162);
    			attr_dev(button1, "class", "menu transparent svelte-17l0p4d");
    			add_location(button1, file$1, 15, 8, 370);
    			add_location(div2, file$1, 14, 4, 356);
    			attr_dev(button2, "class", "menu transparent svelte-17l0p4d");
    			add_location(button2, file$1, 23, 8, 573);
    			add_location(div3, file$1, 22, 4, 559);
    			attr_dev(div4, "id", "taskbar");
    			attr_dev(div4, "class", "header svelte-17l0p4d");
    			add_location(div4, file$1, 4, 0, 43);
    			attr_dev(div5, "class", "header svelte-17l0p4d");
    			add_location(div5, file$1, 31, 0, 757);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div4, t1);
    			append_dev(div4, div1);
    			append_dev(div1, button0);
    			append_dev(div4, t3);
    			append_dev(div4, div2);
    			append_dev(div2, button1);
    			append_dev(div4, t5);
    			append_dev(div4, div3);
    			append_dev(div3, button2);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, div5, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[1], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[2], false, false, false, false),
    					listen_dev(button2, "click", /*click_handler_2*/ ctx[3], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(div5);
    			mounted = false;
    			run_all(dispose);
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
    	validate_slots('Taskbar', slots, []);
    	let { System } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<Taskbar> was created without expected prop 'System'");
    		}
    	});

    	const writable_props = ['System'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Taskbar> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		System.pages.change("Projects");
    	};

    	const click_handler_1 = () => {
    		System.pages.change("Presentation");
    	};

    	const click_handler_2 = () => {
    		System.pages.change("Contacts");
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

    class Taskbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { System: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Taskbar",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get System() {
    		throw new Error("<Taskbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Taskbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Main.svelte generated by Svelte v3.59.2 */

    const { Object: Object_1 } = globals;
    const file = "src/Main.svelte";

    // (100:4) {#if window.innerWidth >= 1000 && window.innerHeight >= 500}
    function create_if_block(ctx) {
    	let switch_instance0;
    	let t;
    	let div;
    	let switch_instance1;
    	let current;
    	var switch_value = Taskbar;

    	function switch_props(ctx) {
    		return {
    			props: { System: /*System*/ ctx[0] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance0 = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	var switch_value_1 = /*System*/ ctx[0].pages.current;

    	function switch_props_1(ctx) {
    		return {
    			props: { System: /*System*/ ctx[0] },
    			$$inline: true
    		};
    	}

    	if (switch_value_1) {
    		switch_instance1 = construct_svelte_component_dev(switch_value_1, switch_props_1(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance0) create_component(switch_instance0.$$.fragment);
    			t = space();
    			div = element("div");
    			if (switch_instance1) create_component(switch_instance1.$$.fragment);
    			attr_dev(div, "id", "body");
    			attr_dev(div, "class", "svelte-1bre7g6");
    			add_location(div, file, 101, 8, 2995);
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance0) mount_component(switch_instance0, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div, anchor);
    			if (switch_instance1) mount_component(switch_instance1, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance0_changes = {};
    			if (dirty & /*System*/ 1) switch_instance0_changes.System = /*System*/ ctx[0];

    			if (switch_value !== (switch_value = Taskbar)) {
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
    					mount_component(switch_instance0, t.parentNode, t);
    				} else {
    					switch_instance0 = null;
    				}
    			} else if (switch_value) {
    				switch_instance0.$set(switch_instance0_changes);
    			}

    			const switch_instance1_changes = {};
    			if (dirty & /*System*/ 1) switch_instance1_changes.System = /*System*/ ctx[0];

    			if (dirty & /*System*/ 1 && switch_value_1 !== (switch_value_1 = /*System*/ ctx[0].pages.current)) {
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
    					mount_component(switch_instance1, div, null);
    				} else {
    					switch_instance1 = null;
    				}
    			} else if (switch_value_1) {
    				switch_instance1.$set(switch_instance1_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance0) transition_in(switch_instance0.$$.fragment, local);
    			if (switch_instance1) transition_in(switch_instance1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance0) transition_out(switch_instance0.$$.fragment, local);
    			if (switch_instance1) transition_out(switch_instance1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (switch_instance0) destroy_component(switch_instance0, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div);
    			if (switch_instance1) destroy_component(switch_instance1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(100:4) {#if window.innerWidth >= 1000 && window.innerHeight >= 500}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div;
    	let current;
    	let if_block = window.innerWidth >= 1000 && window.innerHeight >= 500 && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "id", "html");
    			attr_dev(div, "class", "svelte-1bre7g6");
    			add_location(div, file, 98, 0, 2853);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (window.innerWidth >= 1000 && window.innerHeight >= 500) if_block.p(ctx, dirty);
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
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
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
    	validate_slots('Main', slots, []);

    	let { System = {
    		pages: {
    			current: undefined,
    			list: [],
    			add(name, svelte) {
    				let page = { name, svelte };
    				this.list.push(page);
    			},
    			change(name) {
    				for (const page of this.list) {
    					if (page.name == name) {
    						$$invalidate(0, System.pages.current = page.svelte, System);
    					}
    				}

    				return undefined;
    			}
    		},
    		getDeviceType() {
    			const ua = navigator.userAgent;

    			if ((/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i).test(ua)) {
    				return "tablet";
    			}

    			if ((/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/).test(ua)) {
    				return "mobile";
    			}

    			return "desktop";
    		},
    		projects: { list: [], view: undefined },
    		technos: {
    			list: [],
    			new(name, link) {
    				let o = { name, link };
    				this.list.push(o);
    			},
    			getByName(name) {
    				for (const o of this.list) {
    					if (name == o.name) {
    						return o;
    					}
    				}

    				return undefined;
    			}
    		},
    		categories: { list: [] }
    	} } = $$props;

    	System.technos.new("Javascript", "https://developer.mozilla.org/fr/docs/Web/JavaScript");
    	System.technos.new("Svelte", "https://svelte.dev/");
    	System.technos.new("Python", "https://www.python.org/");
    	System.technos.new("C++", "https://fr.wikipedia.org/wiki/C%2B%2B");
    	System.technos.new("QT", "https://wiki.qt.io/About_Qt");

    	for (const a of Object.keys(apps)) {
    		const app = new apps[a]();

    		for (const category of app.categories) {
    			if (!System.categories.list.includes(category)) {
    				System.categories.list.push(category);
    			}
    		}

    		System.projects.list.push(app);
    	}

    	System.pages.add("Projects", Projects);
    	System.pages.add("Presentation", Presentation);
    	System.pages.add("Contacts", Contacts);
    	System.pages.change("Projects");
    	const writable_props = ['System'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Main> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({
    		System,
    		apps,
    		Projects,
    		Presentation,
    		Contacts,
    		Taskbar
    	});

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [System];
    }

    class Main extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { System: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Main",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get System() {
    		throw new Error("<Main>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Main>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var app = new Main({
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
