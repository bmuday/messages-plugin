import { createHotContext as __vite__createHotContext } from "/vendor/vite-client.js";import.meta.hot = __vite__createHotContext("/src/components/overlay/CommentList.vue.js");import CommentItem from "/src/components/overlay/CommentItem.vue.js"


const _sfc_main = {
  __name: 'CommentList',
  props: {
  reactions: {
    type: Array,
    default: () => []
  }
},
  setup(__props, { expose: __expose }) {
  __expose();



const __returned__ = { CommentItem }
Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
return __returned__
}

}
import { createCommentVNode as _createCommentVNode, createElementVNode as _createElementVNode, openBlock as _openBlock, createElementBlock as _createElementBlock, renderList as _renderList, Fragment as _Fragment, createBlock as _createBlock } from "/vendor/.vite-deps-vue.js__v--bbf8ba7d.js"

const _hoisted_1 = { class: "comment-list" }
const _hoisted_2 = {
  key: 0,
  class: "empty-state"
}

function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    _createCommentVNode(" Empty state "),
    ($props.reactions.length === 0)
      ? (_openBlock(), _createElementBlock("div", _hoisted_2, [...(_cache[0] || (_cache[0] = [
          _createElementVNode("p", null, "No reactions yet. Be the first! 🎉", -1 /* CACHED */)
        ]))]))
      : _createCommentVNode("v-if", true),
    _createCommentVNode(" Comments "),
    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList($props.reactions, (reaction) => {
      return (_openBlock(), _createBlock($setup["CommentItem"], {
        key: reaction.$id,
        reaction: reaction
      }, null, 8 /* PROPS */, ["reaction"]))
    }), 128 /* KEYED_FRAGMENT */))
  ]))
}

import "/src/components/overlay/CommentList.vue__vue_type--style_index--0_scoped--b740c91b_lang.css.js"

_sfc_main.__hmrId = "b740c91b"
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
export default /*#__PURE__*/_export_sfc(_sfc_main, [['render',_sfc_render],['__scopeId',"data-v-b740c91b"],['__file',"/workspaces/messages-plugin/src/components/overlay/CommentList.vue"]])