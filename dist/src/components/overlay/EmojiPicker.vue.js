import { createHotContext as __vite__createHotContext } from "/vendor/vite-client.js";import.meta.hot = __vite__createHotContext("/src/components/overlay/EmojiPicker.vue.js");import { EMOJIS } from "/src/utils/emoji-constants.js.js"


const _sfc_main = {
  __name: 'EmojiPicker',
  props: {
  counts: {
    type: Object,
    default: () => ({})
  },
  userEmoji: {
    type: String,
    default: null
  }
},
  emits: ['select'],
  setup(__props, { expose: __expose }) {
  __expose();





const __returned__ = { get EMOJIS() { return EMOJIS } }
Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
return __returned__
}

}
import { renderList as _renderList, Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, toDisplayString as _toDisplayString, createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, normalizeClass as _normalizeClass } from "/vendor/.vite-deps-vue.js__v--bbf8ba7d.js"

const _hoisted_1 = { class: "emoji-picker" }
const _hoisted_2 = ["title", "onClick"]
const _hoisted_3 = { class: "emoji" }
const _hoisted_4 = {
  key: 0,
  class: "emoji-count"
}

function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList($setup.EMOJIS, (emojiData) => {
      return (_openBlock(), _createElementBlock("button", {
        key: emojiData.id,
        class: _normalizeClass(["emoji-button", { active: $props.userEmoji === emojiData.emoji }]),
        title: emojiData.label,
        onClick: $event => (_ctx.$emit('select', emojiData.emoji))
      }, [
        _createElementVNode("span", _hoisted_3, _toDisplayString(emojiData.emoji), 1 /* TEXT */),
        ($props.counts[emojiData.emoji] > 0)
          ? (_openBlock(), _createElementBlock("span", _hoisted_4, _toDisplayString($props.counts[emojiData.emoji]), 1 /* TEXT */))
          : _createCommentVNode("v-if", true)
      ], 10 /* CLASS, PROPS */, _hoisted_2))
    }), 128 /* KEYED_FRAGMENT */))
  ]))
}

import "/src/components/overlay/EmojiPicker.vue__vue_type--style_index--0_scoped--a3b61587_lang.css.js"

_sfc_main.__hmrId = "a3b61587"
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
export default /*#__PURE__*/_export_sfc(_sfc_main, [['render',_sfc_render],['__scopeId',"data-v-a3b61587"],['__file',"/workspaces/messages-plugin/src/components/overlay/EmojiPicker.vue"]])