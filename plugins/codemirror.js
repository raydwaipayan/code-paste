import Vue from 'vue'
import VueCodemirror from 'vue-codemirror'

// import base style
import 'codemirror/lib/codemirror.css'

// import more codemirror resource...
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/clike/clike'
import 'codemirror/mode/go/go'
import 'codemirror/mode/python/python'
import 'codemirror/mode/dockerfile/dockerfile'

import 'codemirror/theme/base16-dark.css'

// you can set default global options and events when Vue.use
Vue.use(VueCodemirror, {
  options: {
    theme: 'base16-dark',
    lineNumbers: true,
    matchBrackets: true,
    styleActiveLine: true,
    mode: 'javascript'
  }
})
