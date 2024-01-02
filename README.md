## Features
- 微信小程序创建自定义page 和 component 模板
- 支持自定义模板
    - 在项目中建立.vscode 文件夹（如果没有的话）， 创建settings.json文件（如果没有的话）。
    - 在json 文件中增加miniprogram-templates.templates 字段， 用于配置模板， 包含两种字段， component和page 代表 自定义组件 和 页面
    - {{ name }} 占位符表示输入的名称，值为用户填写的页面名称或者组件名称
    - {{ workspaceFolder}} 占位符表示根目录地址， 用于自定义模板引入相对地址
  

  
自定义基础模板
```json
{
  "miniprogram-templates.templates": {
    "component": {
      "folder": "{{name}}",
      "files": [
        {
          "name": "{{name}}.wxml",
          "content": [
            "<view class=\"{{name}}_component_wrapper\">{{name}}</view>"
          ]
        },
        {
          "name": "{{name}}.less",
          "content": [
            ".{{name}}_component_wrapper {",
            "}"
          ]
        },
        {
          "name": "{{name}}.js",
          "content": [
            "Component({",
            "  data: {},",
            "})"
          ]
        },
        {
          "name": "{{name}}.json",
          "content": [
            "{",
            "  \"component\": true,",
            "  \"usingComponents\": {",
            "  }",
            "}"
          ]
        }
      ]
    },
    "page": {
      "folder": "{{name}}",
      "files": [
        {
          "name": "{{name}}.wxml",
          "content": [
            "<view class=\"{{name}}_page_wrapper\">{{name}}</view>"
          ]
        },
        {
          "name": "{{name}}.less",
          "content": [
            ".{{name}}_page_wrapper {",
            "}"
          ]
        },
        {
          "name": "{{name}}.js",
          "content": [
            "Page({",
            "  data: {},",
            "  onLoad() {},",
            "  onShow() {},",
            "  onHide() {}",
            "})"
          ]
        },
        {
          "name": "{{name}}.json",
          "content": [
            "{",
            "  \"usingComponents\": {",
            "  }",
            "}"
          ]
        }
      ]
    }
  }
} 
```

自定义相对路径模板
```json
{
    "miniprogram-templates.templates": {
      "component": {
        "folder": "{{name}}",
        "files": [
          {
            "name": "{{name}}.wxml",
            "content": [
              "<view class=\"{{name}}_component_wrapper\">{{name}}</view>"
            ]
          },
          {
            "name": "{{name}}.less",
            "content": [
              ".{{name}}_component_wrapper {",
              "}"
            ]
          },
          {
            "name": "{{name}}.js",
            "content": [
                "import util from \"{{workspaceFolder}}/utils/util\"",
                "Component({",
                "  data: {}",
                "})"
            ]
          },
          {
            "name": "{{name}}.json",
            "content": [
              "{",
              "  \"component\": true,",
              "  \"usingComponents\": {",
              "  }",
              "}"
            ]
          }
        ]
      },
      "page": {
        "folder": "{{name}}",
        "files": [
          {
            "name": "{{name}}.wxml",
            "content": [
              "<view class=\"{{name}}_page_wrapper\">{{name}}</view>"
            ]
          },
          {
            "name": "{{name}}.less",
            "content": [
              ".{{name}}_page_wrapper {",
              "}"
            ]
          },
          {
            "name": "{{name}}.js",
            "content": [
              "import util from \"{{workspaceFolder}}/utils/util\"",
              "Page({",
              "  data: {},",
              "  onLoad() {},",
              "  onShow() {},",
              "  onHide() {}",
              "})"
            ]
          },
          {
            "name": "{{name}}.json",
            "content": [
              "{",
              "  \"usingComponents\": {",
              "  }",
              "}"
            ]
          }
        ]
      }
    }
  } 
```