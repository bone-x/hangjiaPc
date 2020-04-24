let uuid = 1;
const getIds = () => {
  uuid += 1;
  const i = uuid + 1;
  return i;
};
const generateData = () => {
  const generateChildrenArr = (level = 1, hasChilren = true) => {
    const res = [];
    let key;
    const len = Math.floor(Math.random() * 10 + 1);
    for (let i = 0; i < len; i += 1) {
      key = getIds();
      res.push({
        id: key,
        level,
        label: `${key}菜单${level}-${i}`,
        value: key,
        checked: false,
        children: hasChilren ? [] : null,
      });
    }
    return res;
  };


  const fn = (data = [], level = 1) => {
    if (level === 1) data = generateChildrenArr(1);
    data.forEach((item2) => {
      if (item2.children) {
        item2.children = generateChildrenArr(2);
        item2.children.forEach((item3) => {
          item3.children = generateChildrenArr(3);
          item3.children.forEach((item4) => {
            item4.children = generateChildrenArr(4, false);
          });
        });
      }
    });
    return data;
  };
  return fn();
};

// 商品类目菜单数据（4级）
export const mockCategoryOptions = generateData();

// 商品列表数据
export const mockGoodsList = [{
  date: '2016-05-03',
  name: '王小虎',
  address: '上海市普陀区金沙江路 1518 弄',
}, {
  date: '2016-05-02',
  name: '王小虎',
  address: '上海市普陀区金沙江路 1518 弄',
}, {
  date: '2016-05-04',
  name: '王小虎',
  address: '上海市普陀区金沙江路 1518 弄',
}, {
  date: '2016-05-01',
  name: '王小虎',
  address: '上海市普陀区金沙江路 1518 弄',
}, {
  date: '2016-05-08',
  name: '王小虎',
  address: '上海市普陀区金沙江路 1518 弄',
}, {
  date: '2016-05-06',
  name: '王小虎',
  address: '上海市普陀区金沙江路 1518 弄',
}, {
  date: '2016-05-07',
  name: '王小虎',
  address: '上海市普陀区金沙江路 1518 弄',
}];


export const htmlStr = `<h1 style="text-align: center;">Welcome to the TinyMCE demo!</h1><p style="text-align: center; font-size: 15px;"><img title="TinyMCE Logo" src="//www.tinymce.com/images/glyph-tinymce@2x.png" alt="TinyMCE Logo" width="110" height="97" /><ul>
<li>Our <a href="//www.tinymce.com/docs/">documentation</a> is a great resource for learning how to configure TinyMCE.</li><li>Have a specific question? Visit the <a href="https://community.tinymce.com/forum/">Community Forum</a>.</li><li>We also offer enterprise grade support as part of <a href="https://tinymce.com/pricing">TinyMCE premium subscriptions</a>.</li>
</ul>`;
