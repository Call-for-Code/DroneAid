import replace from 'rollup-plugin-replace'
import json from 'rollup-plugin-json'

const jsonPlugin = json({
  include: 'package.json',
  preferConst: true,
  indent: '  ',
  compact: true,
  namedExports: ['version']
})

export default [
  {
    input: 'src/droneaid-api.js',
    output: [
      {
        format: 'iife',
        compact: true,
        name: 'droneaid',
        file: 'dist/droneaid-tfjs.js'
      },
      {
        format: 'es',
        compact: true,
        name: 'droneaid',
        file: 'dist/droneaid-tfjs.es.js'
      }
    ],
    plugins: [
      replace({
        'process.rollupBrowser': true
      }),
      jsonPlugin
    ]
  }, {
    input: 'src/droneaid-api.js',
    output: [
      {
        format: 'cjs',
        compact: true,
        name: 'droneaid',
        file: 'dist/droneaid-tfjs.cjs.js'
      }
    ],
    plugins: [
      replace({
        'process.rollupBrowser': false
      }),
      jsonPlugin
    ]
  }
]