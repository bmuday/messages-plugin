import { createHotContext as __vite__createHotContext } from "/vendor/vite-client.js";import.meta.hot = __vite__createHotContext("/src/components/overlay/CommentInput.vue.js");import { ref, computed } from "/vendor/.vite-deps-vue.js__v--bbf8ba7d.js"


const _sfc_main = {
  __name: 'CommentInput',
  emits: ['submit'],
  setup(__props, { expose: __expose, emit: __emit }) {
  __expose();

const emit = __emit

// State
const comment = ref('')

// Computed
const canSubmit = computed(() => {
  return comment.value.trim().length > 0 && comment.value.length <= 280
})

// Methods
function submit() {
  if (!canSubmit.value) return

  emit('submit', comment.value.trim())
  comment.value = ''
}

const __returned__ = { emit, comment, canSubmit, submit, ref, computed }
Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
return __returned__
}

}
import { vModelText as _vModelText, withModifiers as _withModifiers, withKeys as _withKeys, createElementVNode as _createElementVNode, withDirectives as _withDirectives, toDisplayString as _toDisplayString, openBlock as _openBlock, createElementBlock as _createElementBlock } from "/vendor/.vite-deps-vue.js__v--bbf8ba7d.js"

const _hoisted_1 = { class: "comment-input" }
const _hoisted_2 = ["onKeydown"]
const _hoisted_3 = { class: "comment-footer" }
const _hoisted_4 = { class: "char-counter" }
const _hoisted_5 = ["disabled"]

function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    _withDirectives(_createElementVNode("textarea", {
      "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => (($setup.comment) = $event)),
      class: "comment-textarea",
      placeholder: "Share your thoughts... (280 characters max)",
      maxlength: "280",
      onKeydown: [
        _withKeys(_withModifiers($setup.submit, ["ctrl"]), ["enter"]),
        _withKeys(_withModifiers($setup.submit, ["meta"]), ["enter"])
      ]
    }, null, 40 /* PROPS, NEED_HYDRATION */, _hoisted_2), [
      [_vModelText, $setup.comment]
    ]),
    _createElementVNode("div", _hoisted_3, [
      _createElementVNode("span", _hoisted_4, _toDisplayString($setup.comment.length) + "/280", 1 /* TEXT */),
      _createElementVNode("button", {
        class: "submit-button",
        disabled: !$setup.canSubmit,
        onClick: $setup.submit
      }, " Post ", 8 /* PROPS */, _hoisted_5)
    ])
  ]))
}

import "/src/components/overlay/CommentInput.vue__vue_type--style_index--0_scoped--94dbfb64_lang.css.js"

_sfc_main.__hmrId = "94dbfb64"
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
export default /*#__PURE__*/_export_sfc(_sfc_main, [['render',_sfc_render],['__scopeId',"data-v-94dbfb64"],['__file',"/workspaces/messages-plugin/src/components/overlay/CommentInput.vue"]])