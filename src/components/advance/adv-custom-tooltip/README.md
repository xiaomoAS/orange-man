### AdvCustomTooltip 文案溢出时展示 tooltip

文案溢出时展示 tooltip

### 代码演示

```javascript
<AdvCustomTooltip
  :showLine="2"
  :tooltipProps="{ content: '内容文案', placement: 'bottom-start' }"
>
  <span>测试文案测试文案测试文案测试文案测试文案测试文案测试文案测试文案测试文案测试文案测试文案测试文案</span>
</AdvCustomTooltip>
```

### API

| 属性         | 说明              | 类型   | 默认值                                      |
| ------------ | ----------------- | ------ | ------------------------------------------- |
| showLine     | 展示行数          | number | 1                                           |
| tooltipProps | 透传 tooltip 属性 | Props  | { placement: 'top-start', effect: 'light' } |

### slot

| 插槽名  | 说明                               |
| ------- | ---------------------------------- |
| default | 需要省略的文案，注意只能用行内元素 |
| content | tooltip 内容                       |
