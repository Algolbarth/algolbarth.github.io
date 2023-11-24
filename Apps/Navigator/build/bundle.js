
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
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
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

    /* src/Menu.svelte generated by Svelte v3.59.2 */

    const file$c = "src/Menu.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	child_ctx[16] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	child_ctx[16] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	child_ctx[16] = i;
    	return child_ctx;
    }

    // (38:4) {#if index > 0}
    function create_if_block_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("/");
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
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(38:4) {#if index > 0}",
    		ctx
    	});

    	return block;
    }

    // (37:0) {#each System.path as folder, index}
    function create_each_block_2(ctx) {
    	let button;
    	let t_value = /*folder*/ ctx[17].name + "";
    	let t;
    	let mounted;
    	let dispose;
    	let if_block = /*index*/ ctx[16] > 0 && create_if_block_3(ctx);

    	function click_handler_3() {
    		return /*click_handler_3*/ ctx[9](/*index*/ ctx[16]);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "link svelte-1r5wuku");
    			add_location(button, file$c, 37, 25, 1110);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_3, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*System*/ 1 && t_value !== (t_value = /*folder*/ ctx[17].name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(37:0) {#each System.path as folder, index}",
    		ctx
    	});

    	return block;
    }

    // (41:0) {#if System.currentFolder != System.folders[0]}
    function create_if_block_2(ctx) {
    	let div3;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let button0;
    	let t2;
    	let div2;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			button0 = element("button");
    			button0.textContent = "..";
    			t2 = space();
    			div2 = element("div");
    			button1 = element("button");
    			button1.textContent = "Retour";
    			if (!src_url_equal(img.src, img_src_value = "Pictures/return.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "icon");
    			attr_dev(img, "class", "svelte-1r5wuku");
    			add_location(img, file$c, 43, 12, 1309);
    			add_location(div0, file$c, 42, 8, 1291);
    			attr_dev(button0, "class", "link svelte-1r5wuku");
    			add_location(button0, file$c, 46, 12, 1394);
    			add_location(div1, file$c, 45, 8, 1376);
    			attr_dev(button1, "class", "link svelte-1r5wuku");
    			add_location(button1, file$c, 49, 12, 1468);
    			add_location(div2, file$c, 48, 8, 1450);
    			attr_dev(div3, "class", "container svelte-1r5wuku");
    			add_location(div3, file$c, 41, 4, 1259);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, img);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			append_dev(div1, button0);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, button1);

    			if (!mounted) {
    				dispose = listen_dev(button1, "click", /*click_handler_4*/ ctx[10], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(41:0) {#if System.currentFolder != System.folders[0]}",
    		ctx
    	});

    	return block;
    }

    // (59:12) {:else}
    function create_else_block_1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "Pictures/folder.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "icon");
    			attr_dev(img, "class", "svelte-1r5wuku");
    			add_location(img, file$c, 59, 16, 1813);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(59:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (57:12) {#if folder.icon}
    function create_if_block_1$5(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*folder*/ ctx[17].icon_url)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "icon");
    			attr_dev(img, "class", "svelte-1r5wuku");
    			add_location(img, file$c, 57, 16, 1735);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*System*/ 1 && !src_url_equal(img.src, img_src_value = /*folder*/ ctx[17].icon_url)) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(57:12) {#if folder.icon}",
    		ctx
    	});

    	return block;
    }

    // (54:0) {#each System.currentFolder.folders as folder, index}
    function create_each_block_1(ctx) {
    	let div3;
    	let div0;
    	let t0;
    	let div1;
    	let button0;
    	let t1_value = /*folder*/ ctx[17].name + "";
    	let t1;
    	let t2;
    	let div2;
    	let button1;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*folder*/ ctx[17].icon) return create_if_block_1$5;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	function click_handler_5() {
    		return /*click_handler_5*/ ctx[11](/*folder*/ ctx[17]);
    	}

    	function click_handler_6() {
    		return /*click_handler_6*/ ctx[12](/*folder*/ ctx[17]);
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			if_block.c();
    			t0 = space();
    			div1 = element("div");
    			button0 = element("button");
    			t1 = text(t1_value);
    			t2 = space();
    			div2 = element("div");
    			button1 = element("button");
    			button1.textContent = "Ouvrir";
    			add_location(div0, file$c, 55, 8, 1683);
    			attr_dev(button0, "class", "link svelte-1r5wuku");
    			add_location(button0, file$c, 63, 12, 1916);
    			add_location(div1, file$c, 62, 8, 1898);
    			attr_dev(button1, "class", "link svelte-1r5wuku");
    			add_location(button1, file$c, 66, 12, 2039);
    			add_location(div2, file$c, 65, 8, 2021);
    			attr_dev(div3, "class", "container svelte-1r5wuku");
    			add_location(div3, file$c, 54, 4, 1651);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			if_block.m(div0, null);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			append_dev(div1, button0);
    			append_dev(button0, t1);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", click_handler_5, false, false, false, false),
    					listen_dev(button1, "click", click_handler_6, false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			}

    			if (dirty & /*System*/ 1 && t1_value !== (t1_value = /*folder*/ ctx[17].name + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(54:0) {#each System.currentFolder.folders as folder, index}",
    		ctx
    	});

    	return block;
    }

    // (76:12) {:else}
    function create_else_block$5(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "https://s2.googleusercontent.com/s2/favicons?domain_url=" + /*link*/ ctx[14].url)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "icon");
    			attr_dev(img, "class", "svelte-1r5wuku");
    			add_location(img, file$c, 76, 16, 2360);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*System*/ 1 && !src_url_equal(img.src, img_src_value = "https://s2.googleusercontent.com/s2/favicons?domain_url=" + /*link*/ ctx[14].url)) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(76:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (74:12) {#if link.icon}
    function create_if_block$5(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*link*/ ctx[14].icon_url)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "icon");
    			attr_dev(img, "class", "svelte-1r5wuku");
    			add_location(img, file$c, 74, 16, 2284);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*System*/ 1 && !src_url_equal(img.src, img_src_value = /*link*/ ctx[14].icon_url)) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(74:12) {#if link.icon}",
    		ctx
    	});

    	return block;
    }

    // (71:0) {#each System.currentFolder.links as link, index}
    function create_each_block$1(ctx) {
    	let div3;
    	let div0;
    	let t0;
    	let div1;
    	let button;
    	let t1_value = /*link*/ ctx[14].name + "";
    	let t1;
    	let t2;
    	let div2;
    	let a;
    	let t3_value = /*link*/ ctx[14].url + "";
    	let t3;
    	let a_href_value;
    	let t4;
    	let mounted;
    	let dispose;

    	function select_block_type_1(ctx, dirty) {
    		if (/*link*/ ctx[14].icon) return create_if_block$5;
    		return create_else_block$5;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	function click_handler_7() {
    		return /*click_handler_7*/ ctx[13](/*link*/ ctx[14]);
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			if_block.c();
    			t0 = space();
    			div1 = element("div");
    			button = element("button");
    			t1 = text(t1_value);
    			t2 = space();
    			div2 = element("div");
    			a = element("a");
    			t3 = text(t3_value);
    			t4 = space();
    			add_location(div0, file$c, 72, 8, 2234);
    			attr_dev(button, "class", "link svelte-1r5wuku");
    			add_location(button, file$c, 80, 12, 2510);
    			add_location(div1, file$c, 79, 8, 2492);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "href", a_href_value = /*link*/ ctx[14].url);
    			add_location(a, file$c, 83, 12, 2627);
    			add_location(div2, file$c, 82, 8, 2609);
    			attr_dev(div3, "class", "container svelte-1r5wuku");
    			add_location(div3, file$c, 71, 4, 2202);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			if_block.m(div0, null);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			append_dev(div1, button);
    			append_dev(button, t1);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, a);
    			append_dev(a, t3);
    			append_dev(div3, t4);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_7, false, false, false, false);
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
    					if_block.m(div0, null);
    				}
    			}

    			if (dirty & /*System*/ 1 && t1_value !== (t1_value = /*link*/ ctx[14].name + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*System*/ 1 && t3_value !== (t3_value = /*link*/ ctx[14].url + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*System*/ 1 && a_href_value !== (a_href_value = /*link*/ ctx[14].url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(71:0) {#each System.currentFolder.links as link, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let h1;
    	let t1;
    	let br0;
    	let br1;
    	let t2;
    	let button0;
    	let t4;
    	let button1;
    	let t6;
    	let button2;
    	let t7;
    	let button2_class_value;
    	let t8;
    	let button3;
    	let t10;
    	let br2;
    	let t11;
    	let t12;
    	let br3;
    	let t13;
    	let t14;
    	let t15;
    	let each2_anchor;
    	let mounted;
    	let dispose;
    	let each_value_2 = /*System*/ ctx[0].path;
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let if_block = /*System*/ ctx[0].currentFolder != /*System*/ ctx[0].folders[0] && create_if_block_2(ctx);
    	let each_value_1 = /*System*/ ctx[0].currentFolder.folders;
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*System*/ ctx[0].currentFolder.links;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Navigator";
    			t1 = space();
    			br0 = element("br");
    			br1 = element("br");
    			t2 = space();
    			button0 = element("button");
    			button0.textContent = "Créer dossier";
    			t4 = space();
    			button1 = element("button");
    			button1.textContent = "Créer raccourci";
    			t6 = space();
    			button2 = element("button");
    			t7 = text("Sauvegarder");
    			t8 = space();
    			button3 = element("button");
    			button3.textContent = "Déconnecter";
    			t10 = space();
    			br2 = element("br");
    			t11 = space();

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t12 = space();
    			br3 = element("br");
    			t13 = space();
    			if (if_block) if_block.c();
    			t14 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t15 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each2_anchor = empty();
    			add_location(h1, file$c, 29, 0, 682);
    			add_location(br0, file$c, 30, 0, 701);
    			add_location(br1, file$c, 30, 5, 706);
    			add_location(button0, file$c, 31, 0, 712);
    			add_location(button1, file$c, 32, 0, 795);
    			attr_dev(button2, "class", button2_class_value = "" + (null_to_empty(/*save_state*/ ctx[1]) + " svelte-1r5wuku"));
    			add_location(button2, file$c, 33, 0, 878);
    			attr_dev(button3, "class", "cancel");
    			add_location(button3, file$c, 34, 0, 949);
    			add_location(br2, file$c, 35, 0, 1042);
    			add_location(br3, file$c, 39, 0, 1201);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, button1, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, button2, anchor);
    			append_dev(button2, t7);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, button3, anchor);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, br2, anchor);
    			insert_dev(target, t11, anchor);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				if (each_blocks_2[i]) {
    					each_blocks_2[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, t12, anchor);
    			insert_dev(target, br3, anchor);
    			insert_dev(target, t13, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t14, anchor);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				if (each_blocks_1[i]) {
    					each_blocks_1[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, t15, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each2_anchor, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[6], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[7], false, false, false, false),
    					listen_dev(
    						button2,
    						"click",
    						function () {
    							if (is_function(/*System*/ ctx[0].save)) /*System*/ ctx[0].save.apply(this, arguments);
    						},
    						false,
    						false,
    						false,
    						false
    					),
    					listen_dev(button3, "click", /*click_handler_2*/ ctx[8], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*save_state*/ 2 && button2_class_value !== (button2_class_value = "" + (null_to_empty(/*save_state*/ ctx[1]) + " svelte-1r5wuku"))) {
    				attr_dev(button2, "class", button2_class_value);
    			}

    			if (dirty & /*returnFolder, System*/ 33) {
    				each_value_2 = /*System*/ ctx[0].path;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_2(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(t12.parentNode, t12);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_2.length;
    			}

    			if (/*System*/ ctx[0].currentFolder != /*System*/ ctx[0].folders[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					if_block.m(t14.parentNode, t14);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*openFolder, System, editFolder*/ 25) {
    				each_value_1 = /*System*/ ctx[0].currentFolder.folders;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(t15.parentNode, t15);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*System, editLink*/ 5) {
    				each_value = /*System*/ ctx[0].currentFolder.links;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each2_anchor.parentNode, each2_anchor);
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
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(button1);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(button2);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(button3);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(br2);
    			if (detaching) detach_dev(t11);
    			destroy_each(each_blocks_2, detaching);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(br3);
    			if (detaching) detach_dev(t13);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t14);
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t15);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each2_anchor);
    			mounted = false;
    			run_all(dispose);
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
    	let save_state;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Menu', slots, []);
    	let { System } = $$props;

    	function editLink(link) {
    		$$invalidate(0, System.edit = link, System);
    		System.pages.change("LinkEdit");
    	}

    	function editFolder(folder) {
    		$$invalidate(0, System.edit = folder, System);
    		System.pages.change("FolderEdit");
    	}

    	function openFolder(folder) {
    		$$invalidate(0, System.currentFolder = folder, System);
    		System.path.push(folder);
    		System.pages.change("Menu");
    	}

    	function returnFolder(index) {
    		$$invalidate(0, System.currentFolder = System.path[index], System);
    		System.path.splice(index + 1, System.path.length - index);
    		System.pages.change("Menu");
    	}

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
    		System.pages.change("FolderAdd");
    	};

    	const click_handler_1 = () => {
    		System.pages.change("LinkAdd");
    	};

    	const click_handler_2 = () => {
    		System.pages.change("Logout");
    	};

    	const click_handler_3 = index => {
    		returnFolder(index);
    	};

    	const click_handler_4 = () => {
    		returnFolder(System.path.length - 2);
    	};

    	const click_handler_5 = folder => {
    		editFolder(folder);
    	};

    	const click_handler_6 = folder => {
    		openFolder(folder);
    	};

    	const click_handler_7 = link => {
    		editLink(link);
    	};

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({
    		System,
    		editLink,
    		editFolder,
    		openFolder,
    		returnFolder,
    		save_state
    	});

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    		if ('save_state' in $$props) $$invalidate(1, save_state = $$props.save_state);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*System*/ 1) {
    			$$invalidate(1, save_state = System.change ? 'validate' : '');
    		}
    	};

    	return [
    		System,
    		save_state,
    		editLink,
    		editFolder,
    		openFolder,
    		returnFolder,
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

    class Menu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { System: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Menu",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get System() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Login.svelte generated by Svelte v3.59.2 */

    const file$b = "src/Login.svelte";

    function create_fragment$b(ctx) {
    	let h1;
    	let t1;
    	let br0;
    	let br1;
    	let t2;
    	let br2;
    	let t3;
    	let input;
    	let t4;
    	let br3;
    	let br4;
    	let t5;
    	let button0;
    	let t7;
    	let br5;
    	let br6;
    	let br7;
    	let t8;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Navigator";
    			t1 = space();
    			br0 = element("br");
    			br1 = element("br");
    			t2 = text("\nFichier de sauvegarde\n");
    			br2 = element("br");
    			t3 = space();
    			input = element("input");
    			t4 = space();
    			br3 = element("br");
    			br4 = element("br");
    			t5 = space();
    			button0 = element("button");
    			button0.textContent = "Se connecter";
    			t7 = space();
    			br5 = element("br");
    			br6 = element("br");
    			br7 = element("br");
    			t8 = space();
    			button1 = element("button");
    			button1.textContent = "Créer un compte";
    			add_location(h1, file$b, 67, 0, 1670);
    			add_location(br0, file$b, 68, 0, 1689);
    			add_location(br1, file$b, 68, 5, 1694);
    			add_location(br2, file$b, 70, 0, 1722);
    			attr_dev(input, "type", "file");
    			add_location(input, file$b, 71, 0, 1729);
    			add_location(br3, file$b, 72, 0, 1762);
    			add_location(br4, file$b, 72, 5, 1767);
    			attr_dev(button0, "class", "validate");
    			add_location(button0, file$b, 73, 0, 1773);
    			add_location(br5, file$b, 74, 0, 1837);
    			add_location(br6, file$b, 74, 5, 1842);
    			add_location(br7, file$b, 74, 10, 1847);
    			add_location(button1, file$b, 75, 0, 1853);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, br2, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, input, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, br3, anchor);
    			insert_dev(target, br4, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, br5, anchor);
    			insert_dev(target, br6, anchor);
    			insert_dev(target, br7, anchor);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, button1, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*input_change_handler*/ ctx[3]),
    					listen_dev(button0, "click", /*login*/ ctx[2], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler*/ ctx[4], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(br2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(br3);
    			if (detaching) detach_dev(br4);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(br5);
    			if (detaching) detach_dev(br6);
    			if (detaching) detach_dev(br7);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(button1);
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
    	validate_slots('Login', slots, []);
    	let { System } = $$props;
    	let files;
    	let save;
    	let step;

    	async function login() {
    		save = await files[0].text();
    		step = 0;
    		$$invalidate(0, System.name = readValue(), System);
    		readFolder();
    		$$invalidate(0, System.currentFolder = System.folders[0], System);
    		System.path.push(System.folders[0]);
    		System.pages.change("Menu");
    	}

    	function readFolder() {
    		let folder = {};
    		folder.name = readValue();

    		if (readValue() == "true") {
    			folder.icon = true;
    		} else {
    			folder.icon = false;
    		}
    		folder.icon_url = readValue();
    		folder.links = [];
    		folder.folders = [];
    		System.folders.push(folder);
    		let folders = parseInt(readValue());

    		for (let i = 0; i < folders; i++) {
    			let f = readFolder();
    			folder.folders.push(f);
    		}

    		let links = parseInt(readValue());

    		for (let i = 0; i < links; i++) {
    			let link = {};
    			link.name = readValue();
    			link.url = readValue();

    			if (readValue() == "true") {
    				link.icon = true;
    			} else {
    				link.icon = false;
    			}
    			link.icon_url = readValue();
    			System.links.push(link);
    			folder.links.push(link);
    		}

    		return folder;
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
    		$$invalidate(1, files);
    	}

    	const click_handler = () => {
    		System.pages.change("Register");
    	};

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({
    		System,
    		files,
    		save,
    		step,
    		login,
    		readFolder,
    		readValue
    	});

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    		if ('files' in $$props) $$invalidate(1, files = $$props.files);
    		if ('save' in $$props) save = $$props.save;
    		if ('step' in $$props) step = $$props.step;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [System, files, login, input_change_handler, click_handler];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { System: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get System() {
    		throw new Error("<Login>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Login>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Register.svelte generated by Svelte v3.59.2 */

    const file$a = "src/Register.svelte";

    function create_fragment$a(ctx) {
    	let h1;
    	let t1;
    	let br0;
    	let br1;
    	let t2;
    	let br2;
    	let t3;
    	let input;
    	let t4;
    	let br3;
    	let br4;
    	let t5;
    	let button0;
    	let t7;
    	let br5;
    	let br6;
    	let br7;
    	let t8;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Navigator";
    			t1 = space();
    			br0 = element("br");
    			br1 = element("br");
    			t2 = text("\nNom de compte\n");
    			br2 = element("br");
    			t3 = space();
    			input = element("input");
    			t4 = space();
    			br3 = element("br");
    			br4 = element("br");
    			t5 = space();
    			button0 = element("button");
    			button0.textContent = "S'inscrire";
    			t7 = space();
    			br5 = element("br");
    			br6 = element("br");
    			br7 = element("br");
    			t8 = space();
    			button1 = element("button");
    			button1.textContent = "J'ai déjà un compte";
    			add_location(h1, file$a, 15, 0, 282);
    			add_location(br0, file$a, 16, 0, 301);
    			add_location(br1, file$a, 16, 5, 306);
    			add_location(br2, file$a, 18, 0, 326);
    			add_location(input, file$a, 19, 0, 332);
    			add_location(br3, file$a, 20, 0, 360);
    			add_location(br4, file$a, 20, 5, 365);
    			attr_dev(button0, "class", "validate");
    			add_location(button0, file$a, 21, 0, 371);
    			add_location(br5, file$a, 22, 0, 436);
    			add_location(br6, file$a, 22, 5, 441);
    			add_location(br7, file$a, 22, 10, 446);
    			add_location(button1, file$a, 23, 0, 452);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, br2, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*name*/ ctx[1]);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, br3, anchor);
    			insert_dev(target, br4, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, br5, anchor);
    			insert_dev(target, br6, anchor);
    			insert_dev(target, br7, anchor);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, button1, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[3]),
    					listen_dev(button0, "click", /*register*/ ctx[2], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler*/ ctx[4], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name*/ 2 && input.value !== /*name*/ ctx[1]) {
    				set_input_value(input, /*name*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(br2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(br3);
    			if (detaching) detach_dev(br4);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(br5);
    			if (detaching) detach_dev(br6);
    			if (detaching) detach_dev(br7);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(button1);
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
    	validate_slots('Register', slots, []);
    	let { System } = $$props;
    	let name;

    	function register() {
    		if (System.checkInput(name)) {
    			$$invalidate(0, System.name = name, System);
    			System.download(name + ".txt", name + "_");
    			System.pages.change("Menu");
    		}
    	}

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<Register> was created without expected prop 'System'");
    		}
    	});

    	const writable_props = ['System'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Register> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		name = this.value;
    		$$invalidate(1, name);
    	}

    	const click_handler = () => {
    		System.pages.change("Login");
    	};

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({ System, name, register });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [System, name, register, input_input_handler, click_handler];
    }

    class Register extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { System: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Register",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get System() {
    		throw new Error("<Register>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Register>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Logout.svelte generated by Svelte v3.59.2 */

    const file$9 = "src/Logout.svelte";

    function create_fragment$9(ctx) {
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
    			t0 = text("Attention vous avez des changements non sauvegardés !\n");
    			br0 = element("br");
    			br1 = element("br");
    			t1 = space();
    			button0 = element("button");
    			button0.textContent = "Se déconnecter quand même";
    			t3 = space();
    			br2 = element("br");
    			t4 = space();
    			button1 = element("button");
    			button1.textContent = "Sauvegarder puis se déconnecter";
    			add_location(br0, file$9, 19, 0, 416);
    			add_location(br1, file$9, 19, 5, 421);
    			attr_dev(button0, "class", "cancel");
    			add_location(button0, file$9, 20, 0, 427);
    			add_location(br2, file$9, 21, 0, 503);
    			attr_dev(button1, "class", "validate");
    			add_location(button1, file$9, 22, 0, 509);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
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
    					listen_dev(button0, "click", /*logout*/ ctx[1], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler*/ ctx[2], false, false, false, false)
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
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Logout', slots, []);
    	let { System } = $$props;

    	if (!System.change) {
    		logout();
    	}

    	function logout() {
    		$$invalidate(0, System.name = "", System);
    		$$invalidate(0, System.links = [], System);
    		$$invalidate(0, System.folders = [], System);
    		$$invalidate(0, System.currentFolder = {}, System);
    		$$invalidate(0, System.path = [], System);
    		$$invalidate(0, System.edit = {}, System);
    		$$invalidate(0, System.change = false, System);
    		System.pages.change("Login");
    	}

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<Logout> was created without expected prop 'System'");
    		}
    	});

    	const writable_props = ['System'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Logout> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		System.save();
    		logout();
    	};

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({ System, logout });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [System, logout, click_handler];
    }

    class Logout extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { System: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Logout",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get System() {
    		throw new Error("<Logout>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Logout>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/LinkAdd.svelte generated by Svelte v3.59.2 */

    const file$8 = "src/LinkAdd.svelte";

    // (52:16) {:else}
    function create_else_block$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Par défaut");
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
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(52:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (50:16) {#if icon}
    function create_if_block_1$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Personalisée");
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
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(50:16) {#if icon}",
    		ctx
    	});

    	return block;
    }

    // (58:4) {#if icon}
    function create_if_block$4(ctx) {
    	let div2;
    	let div0;
    	let t1;
    	let div1;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "URL de l'icône :";
    			t1 = space();
    			div1 = element("div");
    			input = element("input");
    			attr_dev(div0, "class", "label svelte-si0r0s");
    			add_location(div0, file$8, 59, 12, 1404);
    			attr_dev(input, "class", "svelte-si0r0s");
    			add_location(input, file$8, 63, 16, 1511);
    			add_location(div1, file$8, 62, 12, 1489);
    			attr_dev(div2, "class", "line svelte-si0r0s");
    			add_location(div2, file$8, 58, 8, 1373);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, input);
    			set_input_value(input, /*icon_url*/ ctx[4]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[9]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*icon_url*/ 16 && input.value !== /*icon_url*/ ctx[4]) {
    				set_input_value(input, /*icon_url*/ ctx[4]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(58:4) {#if icon}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div9;
    	let div2;
    	let div0;
    	let t1;
    	let div1;
    	let input0;
    	let t2;
    	let div5;
    	let div3;
    	let t4;
    	let div4;
    	let input1;
    	let t5;
    	let div8;
    	let div6;
    	let t7;
    	let div7;
    	let button0;
    	let t8;
    	let t9;
    	let div10;
    	let button1;
    	let t11;
    	let button2;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*icon*/ ctx[3]) return create_if_block_1$4;
    		return create_else_block$4;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*icon*/ ctx[3] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "Titre :";
    			t1 = space();
    			div1 = element("div");
    			input0 = element("input");
    			t2 = space();
    			div5 = element("div");
    			div3 = element("div");
    			div3.textContent = "URL :";
    			t4 = space();
    			div4 = element("div");
    			input1 = element("input");
    			t5 = space();
    			div8 = element("div");
    			div6 = element("div");
    			div6.textContent = "Icône :";
    			t7 = space();
    			div7 = element("div");
    			button0 = element("button");
    			if_block0.c();
    			t8 = space();
    			if (if_block1) if_block1.c();
    			t9 = space();
    			div10 = element("div");
    			button1 = element("button");
    			button1.textContent = "Ajouter";
    			t11 = space();
    			button2 = element("button");
    			button2.textContent = "Annuler";
    			attr_dev(div0, "class", "label svelte-si0r0s");
    			add_location(div0, file$8, 28, 8, 715);
    			attr_dev(input0, "class", "svelte-si0r0s");
    			add_location(input0, file$8, 32, 12, 797);
    			add_location(div1, file$8, 31, 8, 779);
    			attr_dev(div2, "class", "line svelte-si0r0s");
    			add_location(div2, file$8, 27, 4, 688);
    			attr_dev(div3, "class", "label svelte-si0r0s");
    			add_location(div3, file$8, 36, 8, 881);
    			attr_dev(input1, "class", "svelte-si0r0s");
    			add_location(input1, file$8, 40, 12, 961);
    			add_location(div4, file$8, 39, 8, 943);
    			attr_dev(div5, "class", "line svelte-si0r0s");
    			add_location(div5, file$8, 35, 4, 854);
    			attr_dev(div6, "class", "label svelte-si0r0s");
    			add_location(div6, file$8, 44, 8, 1044);
    			add_location(button0, file$8, 48, 12, 1126);
    			add_location(div7, file$8, 47, 8, 1108);
    			attr_dev(div8, "class", "line svelte-si0r0s");
    			add_location(div8, file$8, 43, 4, 1017);
    			attr_dev(div9, "class", "container svelte-si0r0s");
    			add_location(div9, file$8, 26, 0, 660);
    			attr_dev(button1, "class", "validate");
    			add_location(button1, file$8, 70, 4, 1630);
    			add_location(button2, file$8, 71, 4, 1705);
    			set_style(div10, "text-align", "right");
    			add_location(div10, file$8, 69, 0, 1594);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, input0);
    			set_input_value(input0, /*name*/ ctx[1]);
    			append_dev(div9, t2);
    			append_dev(div9, div5);
    			append_dev(div5, div3);
    			append_dev(div5, t4);
    			append_dev(div5, div4);
    			append_dev(div4, input1);
    			set_input_value(input1, /*url*/ ctx[2]);
    			append_dev(div9, t5);
    			append_dev(div9, div8);
    			append_dev(div8, div6);
    			append_dev(div8, t7);
    			append_dev(div8, div7);
    			append_dev(div7, button0);
    			if_block0.m(button0, null);
    			append_dev(div9, t8);
    			if (if_block1) if_block1.m(div9, null);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, div10, anchor);
    			append_dev(div10, button1);
    			append_dev(div10, t11);
    			append_dev(div10, button2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[6]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[7]),
    					listen_dev(button0, "click", /*click_handler*/ ctx[8], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[10], false, false, false, false),
    					listen_dev(button2, "click", /*click_handler_2*/ ctx[11], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name*/ 2 && input0.value !== /*name*/ ctx[1]) {
    				set_input_value(input0, /*name*/ ctx[1]);
    			}

    			if (dirty & /*url*/ 4 && input1.value !== /*url*/ ctx[2]) {
    				set_input_value(input1, /*url*/ ctx[2]);
    			}

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(button0, null);
    				}
    			}

    			if (/*icon*/ ctx[3]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$4(ctx);
    					if_block1.c();
    					if_block1.m(div9, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(div10);
    			mounted = false;
    			run_all(dispose);
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
    	validate_slots('LinkAdd', slots, []);
    	let { System } = $$props;
    	let name;
    	let url;
    	let icon = false;
    	let icon_url = undefined;

    	function addLink() {
    		if (System.checkInput(name) && System.checkInput(url) && (!icon || System.checkInput(icon_url))) {
    			let link = { name, url, icon, icon_url };

    			if (!icon) {
    				link.icon_url = undefined;
    			}
    			System.links.push(link);
    			System.currentFolder.links.push(link);
    			$$invalidate(0, System.change = true, System);
    			System.pages.change("Menu");
    		}
    	}

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<LinkAdd> was created without expected prop 'System'");
    		}
    	});

    	const writable_props = ['System'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LinkAdd> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		name = this.value;
    		$$invalidate(1, name);
    	}

    	function input1_input_handler() {
    		url = this.value;
    		$$invalidate(2, url);
    	}

    	const click_handler = () => {
    		$$invalidate(3, icon = !icon);
    	};

    	function input_input_handler() {
    		icon_url = this.value;
    		$$invalidate(4, icon_url);
    	}

    	const click_handler_1 = () => {
    		addLink();
    	};

    	const click_handler_2 = () => {
    		System.pages.change("Menu");
    	};

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({
    		System,
    		name,
    		url,
    		icon,
    		icon_url,
    		addLink
    	});

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('url' in $$props) $$invalidate(2, url = $$props.url);
    		if ('icon' in $$props) $$invalidate(3, icon = $$props.icon);
    		if ('icon_url' in $$props) $$invalidate(4, icon_url = $$props.icon_url);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		System,
    		name,
    		url,
    		icon,
    		icon_url,
    		addLink,
    		input0_input_handler,
    		input1_input_handler,
    		click_handler,
    		input_input_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class LinkAdd extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { System: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LinkAdd",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get System() {
    		throw new Error("<LinkAdd>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<LinkAdd>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/LinkEdit.svelte generated by Svelte v3.59.2 */

    const file$7 = "src/LinkEdit.svelte";

    // (67:16) {:else}
    function create_else_block$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Par défaut");
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
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(67:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (65:16) {#if icon}
    function create_if_block_1$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Personalisée");
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
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(65:16) {#if icon}",
    		ctx
    	});

    	return block;
    }

    // (73:4) {#if icon}
    function create_if_block$3(ctx) {
    	let div2;
    	let div0;
    	let t1;
    	let div1;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "URL de l'icône :";
    			t1 = space();
    			div1 = element("div");
    			input = element("input");
    			attr_dev(div0, "class", "label svelte-14f7vyw");
    			add_location(div0, file$7, 74, 12, 1925);
    			attr_dev(input, "class", "svelte-14f7vyw");
    			add_location(input, file$7, 78, 16, 2032);
    			add_location(div1, file$7, 77, 12, 2010);
    			attr_dev(div2, "class", "line svelte-14f7vyw");
    			add_location(div2, file$7, 73, 8, 1894);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, input);
    			set_input_value(input, /*icon_url*/ ctx[4]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[10]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*icon_url*/ 16 && input.value !== /*icon_url*/ ctx[4]) {
    				set_input_value(input, /*icon_url*/ ctx[4]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(73:4) {#if icon}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div9;
    	let div2;
    	let div0;
    	let t1;
    	let div1;
    	let input0;
    	let t2;
    	let div5;
    	let div3;
    	let t4;
    	let div4;
    	let input1;
    	let t5;
    	let div8;
    	let div6;
    	let t7;
    	let div7;
    	let button0;
    	let t8;
    	let t9;
    	let div10;
    	let button1;
    	let t11;
    	let button2;
    	let t13;
    	let button3;
    	let t15;
    	let button4;
    	let t17;
    	let button5;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*icon*/ ctx[3]) return create_if_block_1$3;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*icon*/ ctx[3] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "Titre :";
    			t1 = space();
    			div1 = element("div");
    			input0 = element("input");
    			t2 = space();
    			div5 = element("div");
    			div3 = element("div");
    			div3.textContent = "URL :";
    			t4 = space();
    			div4 = element("div");
    			input1 = element("input");
    			t5 = space();
    			div8 = element("div");
    			div6 = element("div");
    			div6.textContent = "Icône :";
    			t7 = space();
    			div7 = element("div");
    			button0 = element("button");
    			if_block0.c();
    			t8 = space();
    			if (if_block1) if_block1.c();
    			t9 = space();
    			div10 = element("div");
    			button1 = element("button");
    			button1.textContent = "Copier";
    			t11 = space();
    			button2 = element("button");
    			button2.textContent = "Déplacer";
    			t13 = space();
    			button3 = element("button");
    			button3.textContent = "Supprimer";
    			t15 = space();
    			button4 = element("button");
    			button4.textContent = "Confirmer";
    			t17 = space();
    			button5 = element("button");
    			button5.textContent = "Annuler";
    			attr_dev(div0, "class", "label svelte-14f7vyw");
    			add_location(div0, file$7, 43, 8, 1235);
    			attr_dev(input0, "class", "svelte-14f7vyw");
    			add_location(input0, file$7, 47, 12, 1317);
    			add_location(div1, file$7, 46, 8, 1299);
    			attr_dev(div2, "class", "line svelte-14f7vyw");
    			add_location(div2, file$7, 42, 4, 1208);
    			attr_dev(div3, "class", "label svelte-14f7vyw");
    			add_location(div3, file$7, 51, 8, 1401);
    			attr_dev(input1, "class", "svelte-14f7vyw");
    			add_location(input1, file$7, 55, 12, 1481);
    			add_location(div4, file$7, 54, 8, 1463);
    			attr_dev(div5, "class", "line svelte-14f7vyw");
    			add_location(div5, file$7, 50, 4, 1374);
    			attr_dev(div6, "class", "label svelte-14f7vyw");
    			add_location(div6, file$7, 59, 8, 1564);
    			add_location(button0, file$7, 63, 12, 1645);
    			add_location(div7, file$7, 62, 8, 1627);
    			attr_dev(div8, "class", "line svelte-14f7vyw");
    			add_location(div8, file$7, 58, 4, 1537);
    			attr_dev(div9, "class", "container svelte-14f7vyw");
    			add_location(div9, file$7, 41, 0, 1180);
    			add_location(button1, file$7, 85, 4, 2151);
    			add_location(button2, file$7, 86, 4, 2230);
    			attr_dev(button3, "class", "cancel");
    			add_location(button3, file$7, 87, 4, 2311);
    			attr_dev(button4, "class", "validate");
    			add_location(button4, file$7, 88, 4, 2389);
    			add_location(button5, file$7, 89, 4, 2467);
    			set_style(div10, "text-align", "right");
    			add_location(div10, file$7, 84, 0, 2115);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, input0);
    			set_input_value(input0, /*name*/ ctx[1]);
    			append_dev(div9, t2);
    			append_dev(div9, div5);
    			append_dev(div5, div3);
    			append_dev(div5, t4);
    			append_dev(div5, div4);
    			append_dev(div4, input1);
    			set_input_value(input1, /*url*/ ctx[2]);
    			append_dev(div9, t5);
    			append_dev(div9, div8);
    			append_dev(div8, div6);
    			append_dev(div8, t7);
    			append_dev(div8, div7);
    			append_dev(div7, button0);
    			if_block0.m(button0, null);
    			append_dev(div9, t8);
    			if (if_block1) if_block1.m(div9, null);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, div10, anchor);
    			append_dev(div10, button1);
    			append_dev(div10, t11);
    			append_dev(div10, button2);
    			append_dev(div10, t13);
    			append_dev(div10, button3);
    			append_dev(div10, t15);
    			append_dev(div10, button4);
    			append_dev(div10, t17);
    			append_dev(div10, button5);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[7]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[8]),
    					listen_dev(button0, "click", /*click_handler*/ ctx[9], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[11], false, false, false, false),
    					listen_dev(button2, "click", /*click_handler_2*/ ctx[12], false, false, false, false),
    					listen_dev(button3, "click", /*click_handler_3*/ ctx[13], false, false, false, false),
    					listen_dev(button4, "click", /*click_handler_4*/ ctx[14], false, false, false, false),
    					listen_dev(button5, "click", /*click_handler_5*/ ctx[15], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name*/ 2 && input0.value !== /*name*/ ctx[1]) {
    				set_input_value(input0, /*name*/ ctx[1]);
    			}

    			if (dirty & /*url*/ 4 && input1.value !== /*url*/ ctx[2]) {
    				set_input_value(input1, /*url*/ ctx[2]);
    			}

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(button0, null);
    				}
    			}

    			if (/*icon*/ ctx[3]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$3(ctx);
    					if_block1.c();
    					if_block1.m(div9, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(div10);
    			mounted = false;
    			run_all(dispose);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LinkEdit', slots, []);
    	let { System } = $$props;
    	let name = System.edit.name;
    	let url = System.edit.url;
    	let icon = System.edit.icon;
    	let icon_url = System.edit.icon_url;

    	function editLink() {
    		if (System.checkInput(name) && System.checkInput(url) && (!icon || System.checkInput(icon_url))) {
    			$$invalidate(0, System.edit.name = name, System);
    			$$invalidate(0, System.edit.url = url, System);
    			$$invalidate(0, System.edit.icon = icon, System);

    			if (icon) {
    				$$invalidate(0, System.edit.icon_url = icon_url, System);
    			} else {
    				$$invalidate(0, System.edit.icon_url = undefined, System);
    			}

    			$$invalidate(0, System.change = true, System);
    			System.pages.change("Menu");
    		}
    	}

    	function removeLink() {
    		for (let i = 0; i < System.links.length; i++) {
    			if (System.links[i] == System.edit) {
    				System.links.splice(i, 1);
    			}
    		}

    		for (let i = 0; i < System.currentFolder.links.length; i++) {
    			if (System.currentFolder.links[i] == System.edit) {
    				System.currentFolder.links.splice(i, 1);
    			}
    		}

    		$$invalidate(0, System.change = true, System);
    		System.pages.change("Menu");
    	}

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<LinkEdit> was created without expected prop 'System'");
    		}
    	});

    	const writable_props = ['System'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LinkEdit> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		name = this.value;
    		$$invalidate(1, name);
    	}

    	function input1_input_handler() {
    		url = this.value;
    		$$invalidate(2, url);
    	}

    	const click_handler = () => {
    		$$invalidate(3, icon = !icon);
    	};

    	function input_input_handler() {
    		icon_url = this.value;
    		$$invalidate(4, icon_url);
    	}

    	const click_handler_1 = () => {
    		System.pages.change("LinkCopy");
    	};

    	const click_handler_2 = () => {
    		System.pages.change("LinkMove");
    	};

    	const click_handler_3 = () => {
    		removeLink();
    	};

    	const click_handler_4 = () => {
    		editLink();
    	};

    	const click_handler_5 = () => {
    		System.pages.change("Menu");
    	};

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({
    		System,
    		name,
    		url,
    		icon,
    		icon_url,
    		editLink,
    		removeLink
    	});

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('url' in $$props) $$invalidate(2, url = $$props.url);
    		if ('icon' in $$props) $$invalidate(3, icon = $$props.icon);
    		if ('icon_url' in $$props) $$invalidate(4, icon_url = $$props.icon_url);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		System,
    		name,
    		url,
    		icon,
    		icon_url,
    		editLink,
    		removeLink,
    		input0_input_handler,
    		input1_input_handler,
    		click_handler,
    		input_input_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5
    	];
    }

    class LinkEdit extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { System: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LinkEdit",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get System() {
    		throw new Error("<LinkEdit>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<LinkEdit>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Tree.svelte generated by Svelte v3.59.2 */
    const file$6 = "src/Tree.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	child_ctx[7] = i;
    	return child_ctx;
    }

    // (18:8) {:else}
    function create_else_block$2(ctx) {
    	let t_value = /*Stockage*/ ctx[1].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*Stockage*/ 2 && t_value !== (t_value = /*Stockage*/ ctx[1].name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(18:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (16:8) {#if System.currentFolder == Stockage}
    function create_if_block_1$2(ctx) {
    	let div;
    	let t_value = /*Stockage*/ ctx[1].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			set_style(div, "display", "inline");
    			set_style(div, "color", "red");
    			add_location(div, file$6, 16, 12, 398);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*Stockage*/ 2 && t_value !== (t_value = /*Stockage*/ ctx[1].name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(16:8) {#if System.currentFolder == Stockage}",
    		ctx
    	});

    	return block;
    }

    // (22:4) {#if Stockage.folders.length > 0}
    function create_if_block$2(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*Stockage*/ ctx[1].folders;
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
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*Tree, System, Stockage, move, tab*/ 15) {
    				each_value = /*Stockage*/ ctx[1].folders;
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
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(22:4) {#if Stockage.folders.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (23:8) {#each Stockage.folders as folder, i}
    function create_each_block(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = Tree_1;

    	function switch_props(ctx) {
    		return {
    			props: {
    				System: /*System*/ ctx[0],
    				Stockage: /*folder*/ ctx[5],
    				move: /*move*/ ctx[2],
    				tab: /*tab*/ ctx[3] + 1
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
    			if (dirty & /*Stockage*/ 2) switch_instance_changes.Stockage = /*folder*/ ctx[5];
    			if (dirty & /*move*/ 4) switch_instance_changes.move = /*move*/ ctx[2];
    			if (dirty & /*tab*/ 8) switch_instance_changes.tab = /*tab*/ ctx[3] + 1;

    			if (switch_value !== (switch_value = Tree_1)) {
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
    		source: "(23:8) {#each Stockage.folders as folder, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div;
    	let button;
    	let img;
    	let img_src_value;
    	let t0;
    	let t1;
    	let div_style_value;
    	let current;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*System*/ ctx[0].currentFolder == /*Stockage*/ ctx[1]) return create_if_block_1$2;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*Stockage*/ ctx[1].folders.length > 0 && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			img = element("img");
    			t0 = space();
    			if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			if (!src_url_equal(img.src, img_src_value = "Pictures/folder.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "icon");
    			attr_dev(img, "class", "svelte-1azpjmv");
    			add_location(img, file$6, 14, 8, 294);
    			attr_dev(button, "class", "svelte-1azpjmv");
    			add_location(button, file$6, 13, 4, 243);
    			attr_dev(div, "style", div_style_value = "margin-left:" + 1.5 * /*tab*/ ctx[3] + "vw;");
    			add_location(div, file$6, 12, 0, 192);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(button, img);
    			append_dev(button, t0);
    			if_block0.m(button, null);
    			append_dev(div, t1);
    			if (if_block1) if_block1.m(div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[4], false, false, false, false);
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

    			if (/*Stockage*/ ctx[1].folders.length > 0) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*Stockage*/ 2) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*tab*/ 8 && div_style_value !== (div_style_value = "margin-left:" + 1.5 * /*tab*/ ctx[3] + "vw;")) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block0.d();
    			if (if_block1) if_block1.d();
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
    	validate_slots('Tree', slots, []);
    	let { System } = $$props;
    	let { Stockage } = $$props;
    	let { move } = $$props;
    	let { tab } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<Tree> was created without expected prop 'System'");
    		}

    		if (Stockage === undefined && !('Stockage' in $$props || $$self.$$.bound[$$self.$$.props['Stockage']])) {
    			console.warn("<Tree> was created without expected prop 'Stockage'");
    		}

    		if (move === undefined && !('move' in $$props || $$self.$$.bound[$$self.$$.props['move']])) {
    			console.warn("<Tree> was created without expected prop 'move'");
    		}

    		if (tab === undefined && !('tab' in $$props || $$self.$$.bound[$$self.$$.props['tab']])) {
    			console.warn("<Tree> was created without expected prop 'tab'");
    		}
    	});

    	const writable_props = ['System', 'Stockage', 'move', 'tab'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tree> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		move(Stockage);
    	};

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    		if ('Stockage' in $$props) $$invalidate(1, Stockage = $$props.Stockage);
    		if ('move' in $$props) $$invalidate(2, move = $$props.move);
    		if ('tab' in $$props) $$invalidate(3, tab = $$props.tab);
    	};

    	$$self.$capture_state = () => ({ Tree: Tree_1, System, Stockage, move, tab });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    		if ('Stockage' in $$props) $$invalidate(1, Stockage = $$props.Stockage);
    		if ('move' in $$props) $$invalidate(2, move = $$props.move);
    		if ('tab' in $$props) $$invalidate(3, tab = $$props.tab);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [System, Stockage, move, tab, click_handler];
    }

    class Tree_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { System: 0, Stockage: 1, move: 2, tab: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tree_1",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get System() {
    		throw new Error("<Tree>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<Tree>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get Stockage() {
    		throw new Error("<Tree>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set Stockage(value) {
    		throw new Error("<Tree>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get move() {
    		throw new Error("<Tree>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set move(value) {
    		throw new Error("<Tree>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tab() {
    		throw new Error("<Tree>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tab(value) {
    		throw new Error("<Tree>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/LinkMove.svelte generated by Svelte v3.59.2 */
    const file$5 = "src/LinkMove.svelte";

    function create_fragment$5(ctx) {
    	let div;
    	let button;
    	let t1;
    	let br;
    	let t2;
    	let switch_instance;
    	let current;
    	let mounted;
    	let dispose;
    	var switch_value = Tree_1;

    	function switch_props(ctx) {
    		return {
    			props: {
    				System: /*System*/ ctx[0],
    				Stockage: /*System*/ ctx[0].folders[0],
    				move: /*move*/ ctx[1],
    				tab: 0
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
    			button = element("button");
    			button.textContent = "Annuler";
    			t1 = space();
    			br = element("br");
    			t2 = space();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			add_location(button, file$5, 17, 4, 437);
    			add_location(br, file$5, 18, 4, 517);
    			attr_dev(div, "class", "svelte-12340r3");
    			add_location(div, file$5, 16, 0, 427);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(div, t1);
    			append_dev(div, br);
    			append_dev(div, t2);
    			if (switch_instance) mount_component(switch_instance, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = {};
    			if (dirty & /*System*/ 1) switch_instance_changes.System = /*System*/ ctx[0];
    			if (dirty & /*System*/ 1) switch_instance_changes.Stockage = /*System*/ ctx[0].folders[0];

    			if (switch_value !== (switch_value = Tree_1)) {
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
    	validate_slots('LinkMove', slots, []);
    	let { System } = $$props;

    	function move(folder) {
    		for (let i = 0; i < System.currentFolder.links.length; i++) {
    			if (System.currentFolder.links[i] == System.edit) {
    				System.currentFolder.links.splice(i, 1);
    			}
    		}

    		folder.links.push(System.edit);
    		System.pages.change("Menu");
    	}

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<LinkMove> was created without expected prop 'System'");
    		}
    	});

    	const writable_props = ['System'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LinkMove> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		System.pages.change("LinkEdit");
    	};

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({ Tree: Tree_1, System, move });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [System, move, click_handler];
    }

    class LinkMove extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { System: 0, move: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LinkMove",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get System() {
    		throw new Error("<LinkMove>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<LinkMove>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get move() {
    		return this.$$.ctx[1];
    	}

    	set move(value) {
    		throw new Error("<LinkMove>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/FolderAdd.svelte generated by Svelte v3.59.2 */

    const file$4 = "src/FolderAdd.svelte";

    // (44:16) {:else}
    function create_else_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Par défaut");
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
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(44:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (42:16) {#if icon}
    function create_if_block_1$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Personalisée");
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
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(42:16) {#if icon}",
    		ctx
    	});

    	return block;
    }

    // (50:4) {#if icon}
    function create_if_block$1(ctx) {
    	let div2;
    	let div0;
    	let t1;
    	let div1;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "URL de l'icône :";
    			t1 = space();
    			div1 = element("div");
    			input = element("input");
    			attr_dev(div0, "class", "label svelte-si0r0s");
    			add_location(div0, file$4, 51, 12, 1241);
    			attr_dev(input, "class", "svelte-si0r0s");
    			add_location(input, file$4, 55, 16, 1348);
    			add_location(div1, file$4, 54, 12, 1326);
    			attr_dev(div2, "class", "line svelte-si0r0s");
    			add_location(div2, file$4, 50, 8, 1210);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, input);
    			set_input_value(input, /*icon_url*/ ctx[3]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_1*/ ctx[7]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*icon_url*/ 8 && input.value !== /*icon_url*/ ctx[3]) {
    				set_input_value(input, /*icon_url*/ ctx[3]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(50:4) {#if icon}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div6;
    	let div2;
    	let div0;
    	let t1;
    	let div1;
    	let input;
    	let t2;
    	let div5;
    	let div3;
    	let t4;
    	let div4;
    	let button0;
    	let t5;
    	let t6;
    	let div7;
    	let button1;
    	let t8;
    	let button2;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*icon*/ ctx[2]) return create_if_block_1$1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*icon*/ ctx[2] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "Titre :";
    			t1 = space();
    			div1 = element("div");
    			input = element("input");
    			t2 = space();
    			div5 = element("div");
    			div3 = element("div");
    			div3.textContent = "Icône :";
    			t4 = space();
    			div4 = element("div");
    			button0 = element("button");
    			if_block0.c();
    			t5 = space();
    			if (if_block1) if_block1.c();
    			t6 = space();
    			div7 = element("div");
    			button1 = element("button");
    			button1.textContent = "Ajouter";
    			t8 = space();
    			button2 = element("button");
    			button2.textContent = "Annuler";
    			attr_dev(div0, "class", "label svelte-si0r0s");
    			add_location(div0, file$4, 28, 8, 715);
    			attr_dev(input, "class", "svelte-si0r0s");
    			add_location(input, file$4, 32, 12, 797);
    			add_location(div1, file$4, 31, 8, 779);
    			attr_dev(div2, "class", "line svelte-si0r0s");
    			add_location(div2, file$4, 27, 4, 688);
    			attr_dev(div3, "class", "label svelte-si0r0s");
    			add_location(div3, file$4, 36, 8, 881);
    			add_location(button0, file$4, 40, 12, 963);
    			add_location(div4, file$4, 39, 8, 945);
    			attr_dev(div5, "class", "line svelte-si0r0s");
    			add_location(div5, file$4, 35, 4, 854);
    			attr_dev(div6, "class", "container svelte-si0r0s");
    			add_location(div6, file$4, 26, 0, 660);
    			attr_dev(button1, "class", "validate");
    			add_location(button1, file$4, 62, 4, 1467);
    			add_location(button2, file$4, 63, 4, 1542);
    			set_style(div7, "text-align", "right");
    			add_location(div7, file$4, 61, 0, 1431);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, input);
    			set_input_value(input, /*name*/ ctx[1]);
    			append_dev(div6, t2);
    			append_dev(div6, div5);
    			append_dev(div5, div3);
    			append_dev(div5, t4);
    			append_dev(div5, div4);
    			append_dev(div4, button0);
    			if_block0.m(button0, null);
    			append_dev(div6, t5);
    			if (if_block1) if_block1.m(div6, null);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, div7, anchor);
    			append_dev(div7, button1);
    			append_dev(div7, t8);
    			append_dev(div7, button2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[5]),
    					listen_dev(button0, "click", /*click_handler*/ ctx[6], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[8], false, false, false, false),
    					listen_dev(button2, "click", /*click_handler_2*/ ctx[9], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name*/ 2 && input.value !== /*name*/ ctx[1]) {
    				set_input_value(input, /*name*/ ctx[1]);
    			}

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(button0, null);
    				}
    			}

    			if (/*icon*/ ctx[2]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					if_block1.m(div6, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(div7);
    			mounted = false;
    			run_all(dispose);
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
    	validate_slots('FolderAdd', slots, []);
    	let { System } = $$props;
    	let name;
    	let icon = false;
    	let icon_url = undefined;

    	function addFile() {
    		if (System.checkInput(name) && (!icon || System.checkInput(icon_url))) {
    			let folder = {
    				name,
    				icon,
    				icon_url,
    				links: [],
    				folders: []
    			};

    			if (!icon) {
    				folder.url = undefined;
    			}
    			System.folders.push(folder);
    			System.currentFolder.folders.push(folder);
    			$$invalidate(0, System.change = true, System);
    			System.pages.change("Menu");
    		}
    	}

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<FolderAdd> was created without expected prop 'System'");
    		}
    	});

    	const writable_props = ['System'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FolderAdd> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		name = this.value;
    		$$invalidate(1, name);
    	}

    	const click_handler = () => {
    		$$invalidate(2, icon = !icon);
    	};

    	function input_input_handler_1() {
    		icon_url = this.value;
    		$$invalidate(3, icon_url);
    	}

    	const click_handler_1 = () => {
    		addFile();
    	};

    	const click_handler_2 = () => {
    		System.pages.change("Menu");
    	};

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({ System, name, icon, icon_url, addFile });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('icon' in $$props) $$invalidate(2, icon = $$props.icon);
    		if ('icon_url' in $$props) $$invalidate(3, icon_url = $$props.icon_url);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		System,
    		name,
    		icon,
    		icon_url,
    		addFile,
    		input_input_handler,
    		click_handler,
    		input_input_handler_1,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class FolderAdd extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { System: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FolderAdd",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get System() {
    		throw new Error("<FolderAdd>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<FolderAdd>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/FolderEdit.svelte generated by Svelte v3.59.2 */

    const file$3 = "src/FolderEdit.svelte";

    // (76:16) {:else}
    function create_else_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Par défaut");
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
    		id: create_else_block.name,
    		type: "else",
    		source: "(76:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (74:16) {#if icon}
    function create_if_block_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Personalisée");
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
    		source: "(74:16) {#if icon}",
    		ctx
    	});

    	return block;
    }

    // (82:4) {#if icon}
    function create_if_block(ctx) {
    	let div2;
    	let div0;
    	let t1;
    	let div1;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "URL de l'icône :";
    			t1 = space();
    			div1 = element("div");
    			input = element("input");
    			attr_dev(div0, "class", "label svelte-14f7vyw");
    			add_location(div0, file$3, 83, 12, 2276);
    			attr_dev(input, "class", "svelte-14f7vyw");
    			add_location(input, file$3, 87, 16, 2383);
    			add_location(div1, file$3, 86, 12, 2361);
    			attr_dev(div2, "class", "line svelte-14f7vyw");
    			add_location(div2, file$3, 82, 8, 2245);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, input);
    			set_input_value(input, /*icon_url*/ ctx[3]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_1*/ ctx[8]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*icon_url*/ 8 && input.value !== /*icon_url*/ ctx[3]) {
    				set_input_value(input, /*icon_url*/ ctx[3]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(82:4) {#if icon}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div6;
    	let div2;
    	let div0;
    	let t1;
    	let div1;
    	let input;
    	let t2;
    	let div5;
    	let div3;
    	let t4;
    	let div4;
    	let button0;
    	let t5;
    	let t6;
    	let div7;
    	let button1;
    	let t8;
    	let button2;
    	let t10;
    	let button3;
    	let t12;
    	let button4;
    	let t14;
    	let button5;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*icon*/ ctx[2]) return create_if_block_1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*icon*/ ctx[2] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "Titre :";
    			t1 = space();
    			div1 = element("div");
    			input = element("input");
    			t2 = space();
    			div5 = element("div");
    			div3 = element("div");
    			div3.textContent = "Icône :";
    			t4 = space();
    			div4 = element("div");
    			button0 = element("button");
    			if_block0.c();
    			t5 = space();
    			if (if_block1) if_block1.c();
    			t6 = space();
    			div7 = element("div");
    			button1 = element("button");
    			button1.textContent = "Copier";
    			t8 = space();
    			button2 = element("button");
    			button2.textContent = "Déplacer";
    			t10 = space();
    			button3 = element("button");
    			button3.textContent = "Supprimer";
    			t12 = space();
    			button4 = element("button");
    			button4.textContent = "Confirmer";
    			t14 = space();
    			button5 = element("button");
    			button5.textContent = "Annuler";
    			attr_dev(div0, "class", "label svelte-14f7vyw");
    			add_location(div0, file$3, 60, 8, 1749);
    			attr_dev(input, "class", "svelte-14f7vyw");
    			add_location(input, file$3, 64, 12, 1831);
    			add_location(div1, file$3, 63, 8, 1813);
    			attr_dev(div2, "class", "line svelte-14f7vyw");
    			add_location(div2, file$3, 59, 4, 1722);
    			attr_dev(div3, "class", "label svelte-14f7vyw");
    			add_location(div3, file$3, 68, 8, 1915);
    			add_location(button0, file$3, 72, 12, 1996);
    			add_location(div4, file$3, 71, 8, 1978);
    			attr_dev(div5, "class", "line svelte-14f7vyw");
    			add_location(div5, file$3, 67, 4, 1888);
    			attr_dev(div6, "class", "container svelte-14f7vyw");
    			add_location(div6, file$3, 58, 0, 1694);
    			add_location(button1, file$3, 94, 4, 2502);
    			add_location(button2, file$3, 95, 4, 2583);
    			attr_dev(button3, "class", "cancel");
    			add_location(button3, file$3, 96, 4, 2666);
    			attr_dev(button4, "class", "validate");
    			add_location(button4, file$3, 97, 4, 2779);
    			add_location(button5, file$3, 98, 4, 2859);
    			set_style(div7, "text-align", "right");
    			add_location(div7, file$3, 93, 0, 2466);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, input);
    			set_input_value(input, /*name*/ ctx[1]);
    			append_dev(div6, t2);
    			append_dev(div6, div5);
    			append_dev(div5, div3);
    			append_dev(div5, t4);
    			append_dev(div5, div4);
    			append_dev(div4, button0);
    			if_block0.m(button0, null);
    			append_dev(div6, t5);
    			if (if_block1) if_block1.m(div6, null);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, div7, anchor);
    			append_dev(div7, button1);
    			append_dev(div7, t8);
    			append_dev(div7, button2);
    			append_dev(div7, t10);
    			append_dev(div7, button3);
    			append_dev(div7, t12);
    			append_dev(div7, button4);
    			append_dev(div7, t14);
    			append_dev(div7, button5);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[6]),
    					listen_dev(button0, "click", /*click_handler*/ ctx[7], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[9], false, false, false, false),
    					listen_dev(button2, "click", /*click_handler_2*/ ctx[10], false, false, false, false),
    					listen_dev(button3, "click", /*click_handler_3*/ ctx[11], false, false, false, false),
    					listen_dev(button4, "click", /*click_handler_4*/ ctx[12], false, false, false, false),
    					listen_dev(button5, "click", /*click_handler_5*/ ctx[13], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name*/ 2 && input.value !== /*name*/ ctx[1]) {
    				set_input_value(input, /*name*/ ctx[1]);
    			}

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(button0, null);
    				}
    			}

    			if (/*icon*/ ctx[2]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					if_block1.m(div6, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(div7);
    			mounted = false;
    			run_all(dispose);
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
    	validate_slots('FolderEdit', slots, []);
    	let { System } = $$props;
    	let name = System.edit.name;
    	let icon = System.edit.icon;
    	let icon_url = System.edit.icon_url;

    	function editFolder() {
    		if (System.checkInput(name) && (!icon || System.checkInput(icon_url))) {
    			$$invalidate(0, System.edit.name = name, System);
    			$$invalidate(0, System.edit.icon = icon, System);

    			if (icon) {
    				$$invalidate(0, System.edit.icon_url = icon_url, System);
    			} else {
    				$$invalidate(0, System.edit.icon_url = undefined, System);
    			}

    			$$invalidate(0, System.change = true, System);
    			System.pages.change("Menu");
    		}
    	}

    	function removeFolder(father, folder) {
    		for (let i = 0; i < folder.links.length; i++) {
    			removeLink(folder.links[i]);
    		}

    		for (let i = 0; i < folder.folders.length; i++) {
    			removeFolder(folder, folder.folders[i]);
    		}

    		for (let i = 0; i < System.folders.length; i++) {
    			if (System.folders[i] == folder) {
    				System.folders.splice(i, 1);
    			}
    		}

    		for (let i = 0; i < father.folders.length; i++) {
    			if (father.folders[i] == folder) {
    				father.folders.splice(i, 1);
    			}
    		}

    		$$invalidate(0, System.change = true, System);
    		System.pages.change("Menu");
    	}

    	function removeLink() {
    		for (let i = 0; i < System.links.length; i++) {
    			if (System.links[i] == System.edit) {
    				System.links.splice(i, 1);
    			}
    		}

    		for (let i = 0; i < System.currentFolder.links.length; i++) {
    			if (System.currentFolder.links[i] == System.edit) {
    				System.currentFolder.links.splice(i, 1);
    			}
    		}
    	}

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<FolderEdit> was created without expected prop 'System'");
    		}
    	});

    	const writable_props = ['System'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FolderEdit> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		name = this.value;
    		$$invalidate(1, name);
    	}

    	const click_handler = () => {
    		$$invalidate(2, icon = !icon);
    	};

    	function input_input_handler_1() {
    		icon_url = this.value;
    		$$invalidate(3, icon_url);
    	}

    	const click_handler_1 = () => {
    		System.pages.change("FolderCopy");
    	};

    	const click_handler_2 = () => {
    		System.pages.change("FolderMove");
    	};

    	const click_handler_3 = () => {
    		removeFolder(System.currentFolder, System.edit);
    	};

    	const click_handler_4 = () => {
    		editFolder();
    	};

    	const click_handler_5 = () => {
    		System.pages.change("Menu");
    	};

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({
    		System,
    		name,
    		icon,
    		icon_url,
    		editFolder,
    		removeFolder,
    		removeLink
    	});

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('icon' in $$props) $$invalidate(2, icon = $$props.icon);
    		if ('icon_url' in $$props) $$invalidate(3, icon_url = $$props.icon_url);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		System,
    		name,
    		icon,
    		icon_url,
    		editFolder,
    		removeFolder,
    		input_input_handler,
    		click_handler,
    		input_input_handler_1,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5
    	];
    }

    class FolderEdit extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { System: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FolderEdit",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get System() {
    		throw new Error("<FolderEdit>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<FolderEdit>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/FolderMove.svelte generated by Svelte v3.59.2 */
    const file$2 = "src/FolderMove.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let button;
    	let t1;
    	let br;
    	let t2;
    	let switch_instance;
    	let current;
    	let mounted;
    	let dispose;
    	var switch_value = Tree_1;

    	function switch_props(ctx) {
    		return {
    			props: {
    				System: /*System*/ ctx[0],
    				Stockage: /*System*/ ctx[0].folders[0],
    				move: /*move*/ ctx[1],
    				tab: 0
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
    			button = element("button");
    			button.textContent = "Annuler";
    			t1 = space();
    			br = element("br");
    			t2 = space();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			add_location(button, file$2, 17, 4, 445);
    			add_location(br, file$2, 18, 4, 527);
    			attr_dev(div, "class", "svelte-12340r3");
    			add_location(div, file$2, 16, 0, 435);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(div, t1);
    			append_dev(div, br);
    			append_dev(div, t2);
    			if (switch_instance) mount_component(switch_instance, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = {};
    			if (dirty & /*System*/ 1) switch_instance_changes.System = /*System*/ ctx[0];
    			if (dirty & /*System*/ 1) switch_instance_changes.Stockage = /*System*/ ctx[0].folders[0];

    			if (switch_value !== (switch_value = Tree_1)) {
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
    	validate_slots('FolderMove', slots, []);
    	let { System } = $$props;

    	function move(folder) {
    		for (let i = 0; i < System.currentFolder.folders.length; i++) {
    			if (System.currentFolder.folders[i] == System.edit) {
    				System.currentFolder.folders.splice(i, 1);
    			}
    		}

    		folder.folders.push(System.edit);
    		System.pages.change("Menu");
    	}

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<FolderMove> was created without expected prop 'System'");
    		}
    	});

    	const writable_props = ['System'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FolderMove> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		System.pages.change("FolderEdit");
    	};

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({ Tree: Tree_1, System, move });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [System, move, click_handler];
    }

    class FolderMove extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { System: 0, move: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FolderMove",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get System() {
    		throw new Error("<FolderMove>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<FolderMove>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get move() {
    		return this.$$.ctx[1];
    	}

    	set move(value) {
    		throw new Error("<FolderMove>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/FolderCopy.svelte generated by Svelte v3.59.2 */
    const file$1 = "src/FolderCopy.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let button;
    	let t1;
    	let br;
    	let t2;
    	let switch_instance;
    	let current;
    	let mounted;
    	let dispose;
    	var switch_value = Tree_1;

    	function switch_props(ctx) {
    		return {
    			props: {
    				System: /*System*/ ctx[0],
    				Stockage: /*System*/ ctx[0].folders[0],
    				move: /*copy*/ ctx[1],
    				tab: 0
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
    			button = element("button");
    			button.textContent = "Annuler";
    			t1 = space();
    			br = element("br");
    			t2 = space();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			add_location(button, file$1, 44, 4, 1078);
    			add_location(br, file$1, 45, 4, 1160);
    			attr_dev(div, "class", "svelte-12340r3");
    			add_location(div, file$1, 43, 0, 1068);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(div, t1);
    			append_dev(div, br);
    			append_dev(div, t2);
    			if (switch_instance) mount_component(switch_instance, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = {};
    			if (dirty & /*System*/ 1) switch_instance_changes.System = /*System*/ ctx[0];
    			if (dirty & /*System*/ 1) switch_instance_changes.Stockage = /*System*/ ctx[0].folders[0];

    			if (switch_value !== (switch_value = Tree_1)) {
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
    	validate_slots('FolderCopy', slots, []);
    	let { System } = $$props;

    	function copy(folder) {
    		copyFolder(System.edit, folder);
    		System.pages.change("Menu");
    	}

    	function copyFolder(folder, emplacement) {
    		let newFolder = {
    			name: folder.name,
    			icon: folder.icon,
    			icon_url: folder.icon_url,
    			links: [],
    			folders: []
    		};

    		for (let i = 0; i < folder.folders.length; i++) {
    			copyFolder(folder.folders[i], newFolder);
    		}

    		for (let i = 0; i < folder.links.length; i++) {
    			copyLink(folder.links[i], newFolder);
    		}

    		System.folders.push(newFolder);
    		emplacement.folders.push(newFolder);
    	}

    	function copyLink(link, emplacement) {
    		let newLink = {
    			name: link.name,
    			url: link.url,
    			icon: link.icon,
    			icon_url: link.icon_url
    		};

    		System.links.push(newLink);
    		emplacement.links.push(newLink);
    	}

    	$$self.$$.on_mount.push(function () {
    		if (System === undefined && !('System' in $$props || $$self.$$.bound[$$self.$$.props['System']])) {
    			console.warn("<FolderCopy> was created without expected prop 'System'");
    		}
    	});

    	const writable_props = ['System'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FolderCopy> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		System.pages.change("FolderEdit");
    	};

    	$$self.$$set = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	$$self.$capture_state = () => ({ Tree: Tree_1, System, copy, copyFolder, copyLink });

    	$$self.$inject_state = $$props => {
    		if ('System' in $$props) $$invalidate(0, System = $$props.System);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [System, copy, click_handler];
    }

    class FolderCopy extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { System: 0, copy: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FolderCopy",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get System() {
    		throw new Error("<FolderCopy>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set System(value) {
    		throw new Error("<FolderCopy>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get copy() {
    		return this.$$.ctx[1];
    	}

    	set copy(value) {
    		throw new Error("<FolderCopy>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.59.2 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let div;
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
    			div = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div, "id", "root");
    			attr_dev(div, "class", "svelte-a428er");
    			add_location(div, file, 102, 0, 2615);
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
    		name: "",
    		links: [],
    		folders: [],
    		currentFolder: {},
    		path: [],
    		change: false,
    		edit: {},
    		download(nom, text) {
    			var element = document.createElement('a');
    			element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    			element.setAttribute('download', nom);
    			element.style.display = 'none';
    			document.body.appendChild(element);
    			element.click();
    			document.body.removeChild(element);
    		},
    		save() {
    			let text = "";
    			text += System.name + "_";
    			text += System.saveFolder(System.folders[0]);
    			System.download(System.name + ".txt", text);
    			$$invalidate(0, System.change = false, System);
    		},
    		saveFolder(folder) {
    			let text = "";
    			text += folder.name + "_" + folder.icon + "_" + folder.icon_url + "_";
    			text += folder.folders.length + "_";

    			for (const f of folder.folders) {
    				text += System.saveFolder(f);
    			}

    			text += folder.links.length + "_";

    			for (const link of folder.links) {
    				text += link.name + "_" + link.url + "_" + link.icon + "_" + link.icon_url + "_";
    			}

    			return text;
    		},
    		checkInput(input) {
    			if ([undefined, "", " "].includes(input)) {
    				return false;
    			}

    			return true;
    		}
    	};

    	System.pages.add("Menu", Menu);
    	System.pages.add("Login", Login);
    	System.pages.add("Register", Register);
    	System.pages.add("Logout", Logout);
    	System.pages.add("LinkAdd", LinkAdd);
    	System.pages.add("LinkEdit", LinkEdit);
    	System.pages.add("LinkMove", LinkMove);
    	System.pages.add("FolderAdd", FolderAdd);
    	System.pages.add("FolderEdit", FolderEdit);
    	System.pages.add("FolderMove", FolderMove);
    	System.pages.add("FolderCopy", FolderCopy);
    	System.pages.change("Login");
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		System,
    		Menu,
    		Login,
    		Register,
    		Logout,
    		LinkAdd,
    		LinkEdit,
    		LinkMove,
    		FolderAdd,
    		FolderEdit,
    		FolderMove,
    		FolderCopy
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
