/***
  author cyb
  date 12/12/2016 22:55
  created by sublime3

***/
/*
  element   点击触发下载的元素,任何可点击的元素都可以，一般用button和a标签
  url       下载的url，可以是静态的，也可以是动态生成的，类型为字符串或函数
  condition 点击下载时的额外条件，一般用于按条件导出数据到excel文件等，类型为对象
  callback  下载出错时的回调函数
  beforeDownload  点击下载之前需要执行的函数，可用于鉴权，不合法的用户不能下载
  
  使用该组件的前提是下载的url和代码所在页面的url是同源或者能够通过设置document.domain实现iframe和目标页面互相访问，
  因为frameElement.callback中的frameElement只有同源，设置了document.domain，页面本身就是最上层的页面时才有值，其他情况下都是null
*/
function Download(config) {
  this.element = config.element;
  this.url = config.url;
  this.condition = config.condition;
  this._callback = config.callback;
  this._beforeDownload = config.beforeDownload
  this.init();
}

Download.prototype.init = function() {
  var self = this;
  $(this.element).click(function() {//绑定目标元素，实现iframe懒加载
      if (self.beforeDownload() === false) {
        return false;
      }
      
      if ($('#iframeForDownload').length != 0) {//复用第一次创建的iframe
          var url =  self.getUrl();
          $('#iframeForDownload').attr('src',url + self.makeQueryStr());
          return false;
      }
      var _iframe = self.createIframe();
      $(document.body).append(_iframe);
      return false;//返回false，以防触发a标签的默认行为
   })
}

Download.prototype.beforeDownload= function() {//该函数返回false代码不能进行下载
  if (this._beforeDownload && this.isFunction(this._beforeDownload) && this._beforeDownload() === false) {
    return false;
  }
  else {
    return true;
  }
}

Download.prototype.createIframe = function() {//创建iframe
  var _iframe = document.createElement('iframe');
  _iframe.id = 'iframeForDownload';
  _iframe.src = this.getUrl() + this.makeQueryStr();
  _iframe.style.display = 'none';
  _iframe.callback = this.callback.bind(this);
  return _iframe;
}

Download.prototype.getUrl = function() {//获取url
  return this.isFunction(this.url) ? this.url() : this.url;
}

Download.prototype.isFunction = function(variable) {//判断变量是否为函数
   return Object.prototype.toString.call(variable) === '[object Function]';
}

Download.prototype.callback = function(ret) {
   this.isFunction(this._callback) && this._callback(ret);
}

Download.prototype.makeQueryStr = function() {//格式化查询条件字符串
    if (!this.condition) {
      return '';
    }
    var self = this;
    var condition = this.condition;
    var result = [];
    var keys = Object.keys(condition);
    $(keys).each(function(index,key) {
      var value = self.isFunction(condition[key]) ? condition[key].call(self,key) : condition[key].val();
        result.push(key+'='+value);
    })
    return "?" + result.join('&');
}
