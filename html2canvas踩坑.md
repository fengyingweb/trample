## html2canvas踩坑

最近有个项目中有个需求, 需要前端把整个页面合成一张图片, 能够在微信端长按保存为图片的功能, 于是去百度的一下, 看到采用的方案用[html2canvas](https://github.com/niklasvh/html2canvas)解决.

### 清晰度问题

当采用背景图片时, 生成的图片不是很清晰, 解决办法是直接用`img`标签.

### 图片跨域问题

当页面中存在跨域的图片时, [html2canvas](https://github.com/niklasvh/html2canvas) 合成图片在调用方canvas.toDataURL("image/jpeg")时会遇到跨域的图片

解决办法是后台需配合设置允许图片跨域, 前端设置`img`的属性crossOrigin值为anonymous, 再将跨域图片的链接地址转换为blob地址, html2canvas配置属性useCORS为true, 最后在等img图片加载完后onload执行合成图片的方法, 直接上代码:

``` javascript
/*
 * 跨域图片转blob
 @params url
*/
  function imgUrlToBlob(url, cb) {
			let canvas = document.createElement('canvas');
			let ctx = canvas.getContext('2d');
			let img = new Image();
			img.crossOrigin = 'anonymous'; // 跨域设置
			img.src = url + '?' + new Date().getTime(); // 跨域图片拼接上时间戳
			img.onload = ()=> {
				canvas.width = img.width;
				canvas.height = img.height;
				ctx.drawImage(img, 0, 0, img.width, img.height);
				let dataUrl = canvas.toDataURL('image/png');
				let blobUrl = dataURItoBlob(dataUrl);
				let finalUrl = URL.createObjectURL(blobUrl);
				console.log('finalUrl: ', finalUrl);
        cb && cb(finalUrl);
				canvas = null;
			}
	}

/*
 * 图片base64转blob
 * @params base64Data
   @return blob object
*/
  function dataURItoBlob(base64Data) {
		let byteString;
		if(base64Data.split(',')[0].indexOf('base64') >= 0){
			byteString = atob(base64Data.split(',')[1]);
		}
		else{
			byteString = unescape(base64Data.split(',')[1]);
		}
		let mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
		let ia = new Uint8Array(byteString.length);
		for(let i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}
		return new Blob([ia], {
			type: mimeString
		});
	}

// 合成图片
	function	htmlToImage(bgHeight) {
			let pageNode = document.querySelector('#bg-wrapper');
			html2canvas(pageNode, {
        useCORS: true // 跨域
      }).then(pageCanvas=> {
				let imgUrl = pageCanvas.toDataURL('image/png', 1);
				let pageImg = new Image();
				pageImg.src = imgUrl;
				pageImg.style.width = '100vw';
				let pageHeight = pageNode.clientHeight
				pageImg.style.height = bgHeight + 'px';
				pageNode.parentElement.replaceChild(pageImg, pageNode);
			}).catch(error=> {
				console.log('html2canvas error: ', error);
			});
			
	}

 let bgImg = document.querySelector('#bg-img');

 imgUrlToBlob('跨域的图片地址', (resUrl)=> {
   bgImg.src = resUrl;
 });

 bgImg.onload = ()=> {
   let bgHeight = bgImg.height;
   htmlToImage(bgHeight);
 }
```
