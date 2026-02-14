import { createHotContext as __vite__createHotContext } from "/vendor/vite-client.js";import.meta.hot = __vite__createHotContext("/src/components/overlay/CommentItem.vue.js");import { computed } from "/vendor/.vite-deps-vue.js__v--bbf8ba7d.js"
import { formatRelativeTime } from "/src/utils/date-utils.js.js"


const _sfc_main = {
  __name: 'CommentItem',
  props: {
  reaction: {
    type: Object,
    required: true
  }
},
  setup(__props, { expose: __expose }) {
  __expose();

const props = __props

// Computed
const username = computed(() => {
  // In a real app, you'd fetch user data
  // For now, use userId
  return props.reaction.userId.substring(0, 8)
})

const userInitial = computed(() => {
  return username.value.charAt(0).toUpperCase()
})

const relativeTime = computed(() => {
  return formatRelativeTime(props.reaction.createdAt)
})

const __returned__ = { props, username, userInitial, relativeTime, computed, get formatRelativeTime() { return formatRelativeTime } }
Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
return __returned__
}

}
import { toDisplayString as _toDisplayString, createElementVNode as _createElementVNode, openBlock as _openBlock, createElementBlock as _createElementBlock, createCommentVNode as _createCommentVNode } from "/vendor/.vite-deps-vue.js__v--bbf8ba7d.js"

const _hoisted_1 = { class: "comment-item" }
const _hoisted_2 = { class: "comment-header" }
const _hoisted_3 = { class: "avatar" }
const _hoisted_4 = { class: "comment-username" }
const _hoisted_5 = { class: "comment-time" }
const _hoisted_6 = { class: "comment-emoji" }
const _hoisted_7 = {
  key: 0,
  class: "comment-text"
}

function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    _createElementVNode("div", _hoisted_2, [
      _createElementVNode("div", _hoisted_3, _toDisplayString($setup.userInitial), 1 /* TEXT */),
      _createElementVNode("span", _hoisted_4, _toDisplayString($setup.username), 1 /* TEXT */),
      _createElementVNode("span", _hoisted_5, _toDisplayString($setup.relativeTime), 1 /* TEXT */)
    ]),
    _createElementVNode("div", _hoisted_6, _toDisplayString($props.reaction.emoji), 1 /* TEXT */),
    ($props.reaction.comment)
      ? (_openBlock(), _createElementBlock("div", _hoisted_7, _toDisplayString($props.reaction.comment), 1 /* TEXT */))
      : _createCommentVNode("v-if", true)
  ]))
}

import "/src/components/overlay/CommentItem.vue__vue_type--style_index--0_scoped--d5f0e7e5_lang.css.js"

_sfc_main.__hmrId = "d5f0e7e5"
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
export default /*#__PURE__*/_export_sfc(_sfc_main, [['render',_sfc_render],['__scopeId',"data-v-d5f0e7e5"],['__file',"/workspaces/messages-plugin/src/components/overlay/CommentItem.vue"]])