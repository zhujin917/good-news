let picBase64 = null;
function createNews(type, context) {
	let img = document.getElementById("main_img");
	img.innerHTML = `
	<img class="bg" src="./img/${type}.webp" />
	<p class="context" style="${type == "good_news" ?
			`color: #dc3023;` :
			`color: #5a5a5a;`}">
		${context}
	</p>
	`;
};
function createNewsByImage(type, contextBase64) {
	let img = document.getElementById("main_img");
	img.innerHTML = `
	<img class="bg" src="./img/${type}.webp" />
	<img class="ft" src="${contextBase64}" ${type == "bad_news" ? `style="filter: grayscale(1);"` : ""} />
	`;
};
function getNewsType() {
	if (document.getElementById("good").checked) {
		return "good_news";
	}
	else if (document.getElementById("bad").checked) {
		return "bad_news";
	}
	return "unknown";
};

window.addEventListener("load", () => {
	createNews("good_news", "114514");

	document.getElementById("main_make").addEventListener("click", () => {
		picBase64 = null;
		createNews(getNewsType(), document.getElementById("main_context").value);
	});
	document.getElementById("good").onchange = document.getElementById("bad").onchange = () => {
		if (picBase64 === null) {
			createNews(getNewsType(), document.getElementById("main_context").value);
		}
		else {
			createNewsByImage(getNewsType(), picBase64);
		}
	};
	document.getElementById("main_makepic").addEventListener("click", () => {
		document.getElementById("picSelector").click();
	});
	document.getElementById("picSelector").addEventListener("change", function () {
		let reader = new FileReader();
		reader.readAsDataURL(this.files[0]);
		reader.addEventListener("load", () => {
			picBase64 = reader.result;
			createNewsByImage(getNewsType(), picBase64);
		});
		this.value = null;
	});

	document.getElementById("main_copy").addEventListener("click", () => {
		domtoimage.toBlob(document.getElementById("main_img")).then((blob) => {
			navigator.clipboard.write([new ClipboardItem({
				"image/png": blob
			})]);
			setTimeout(() => {
				alert("复制成功！");
			}, 200);
		});
	});
	document.getElementById("main_save").addEventListener("click", () => {
		domtoimage.toJpeg(document.getElementById("main_img")).then((url) => {
			let a = document.createElement("a");
			a.href = url;
			a.download = `${getNewsType()}.jpg`;
			a.click();
		});
	});
	document.getElementById("main_share").addEventListener("click", () => {
		domtoimage.toBlob(document.getElementById("main_img")).then((blob) => {
			navigator.share({
				files: [new File([blob], `${getNewsType()}.png`, { type: "image/png" })]
			}).then(() => {
				alert("分享成功！");
			}).catch(() => {
				alert("分享失败！");
			});
		});
	});
});