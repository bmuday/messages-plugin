import { createHotContext as __vite__createHotContext } from "/vendor/vite-client.js";import.meta.hot = __vite__createHotContext("/src/components/overlay/FloatingButton.vue.js");import { computed } from "/vendor/.vite-deps-vue.js__v--bbf8ba7d.js"


const _sfc_main = {
  __name: 'FloatingButton',
  props: {
  count: {
    type: Number,
    default: 0
  }
},
  emits: ['click'],
  setup(__props, { expose: __expose }) {
  __expose();

const props = __props



const displayCount = computed(() => {
  if (props.count > 99) {
    return '99+'
  }
  return props.count
})

const __returned__ = { props, displayCount, computed }
Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
return __returned__
}

}
import { createElementVNode as _createElementVNode, toDisplayString as _toDisplayString, openBlock as _openBlock, createElementBlock as _createElementBlock, createCommentVNode as _createCommentVNode } from "/vendor/.vite-deps-vue.js__v--bbf8ba7d.js"

const _hoisted_1 = {
  key: 0,
  class: "badge"
}

function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("button", {
    class: "floating-button",
    onClick: _cache[0] || (_cache[0] = $event => (_ctx.$emit('click'))),
    title: "EmojiFeed - React to this page"
  }, [
    _cache[1] || (_cache[1] = _createElementVNode("span", { class: "button-icon" }, "🎭", -1 /* CACHED */)),
    ($props.count > 0)
      ? (_openBlock(), _createElementBlock("span", _hoisted_1, _toDisplayString($setup.displayCount), 1 /* TEXT */))
      : _createCommentVNode("v-if", true)
  ]))
}

import "/src/components/overlay/FloatingButton.vue__vue_type--style_index--0_scoped--21ebbbd1_lang.css.js"

_sfc_main.__hmrId = "21ebbbd1"
typeof __VUE_HMR_RUNTIME__ !== 'undefined' && __VUE_HMR_RUNTIME__.createRecord(_sfc_main.__hmrId, _sfc_main)
import.meta.hot.on('file-changed', ({ file }) => {
  __VUE_HMR_RUNTIME__.CHANGED_FILE = file
})
import.meta.hot.accept(mod => {
  if (!mod) return
  const { default: updated, _rerender_only } = mod
  if (_rerender_only) {
    __VUE_HMR_RUNTIME__.rerender(updated.__hmrId, updated.render)
  } else {
    __VUE_HMR_RUNTIME__.reload(updated.__hmrId, updated)
  }
})
import _export_sfc from "/vendor/id-__x00__plugin-vue:export-helper.js"
export default /*#__PURE__*/_export_sfc(_sfc_main, [['render',_sfc_render],['__scopeId',"data-v-21ebbbd1"],['__file',"/workspaces/messages-plugin/src/components/overlay/FloatingButton.vue"]])