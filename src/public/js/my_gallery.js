// gallery.js
window.MediaGallery = (function () {
  let currentFolder = null;
  let container = null;
  let onSelect = null;

  function init(rootEl, options = {}) {
    container = rootEl;
    onSelect = options.onSelect || (() => {});

    // render UI skeleton
    container.innerHTML = `
      <div class="gallery-container">
        <div class="col-left">
          <h4>📂 Thư mục</h4>
          <ul class="folder-list"></ul>
        </div>
        <div class="col-right">
          <div>
            <span style="font-size: 20px; font-weight: bold">Gallery</span>
            <button class="btn-upload btn btn-outline-success">Upload</button>
          </div>

          <input type="file" class="file-input" style="
              border: 1px dashed #000;
              padding: 40px 30%;
              border-radius: 10px;
              margin: 20px 0px;
              width: 100%;
          " />
          <img class="preview" src="#" alt="Preview" style="display:none;max-width:300px;margin-top:10px" />

          <div class="scroll-wrapper">
            <div class="image-gallery"></div>
          </div>
        </div>
      </div>
    `;

    bindEvents();
    loadFolders();
  }

  function bindEvents() {
    const fileInput = container.querySelector(".file-input");
    const preview = container.querySelector(".preview");
    const uploadBtn = container.querySelector(".btn-upload");

    // preview file
    fileInput.addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          preview.src = e.target.result;
          preview.style.display = "block";
        };
        reader.readAsDataURL(file);
      } else {
        preview.src = "#";
        preview.style.display = "none";
      }
    });

    // upload
    uploadBtn.addEventListener("click", async () => {
      if (!currentFolder) return alert("Vui lòng chọn thư mục trước khi upload!");
      const file = fileInput.files[0];
      if (!file) return alert("Chọn file!");

      const form = new FormData();
      form.append("file", file);
      form.append("folder", currentFolder);

      await fetch("/admin/img/upload", { method: "POST", body: form });
      loadImages(currentFolder);
      fileInput.value = "";
      preview.style.display = "none";
    });
  }

  function loadFolders() {
    fetch("/admin/img/list-folder")
      .then((res) => res.json())
      .then((data) => {
        const folderList = container.querySelector(".folder-list");
        folderList.innerHTML = "";
        data.folders.forEach((folder) => {
          const li = document.createElement("li");
          li.textContent = folder;
          li.style.cursor = "pointer";
          li.onclick = () => {
            currentFolder = folder;
            [...folderList.children].forEach((el) => el.classList.remove("active-folder"));
            li.classList.add("active-folder");
            loadImages(folder);
          };
          folderList.appendChild(li);
        });
      });
  }

  function loadImages(folder) {
    fetch(`/admin/img/list-image/${folder}`)
      .then((res) => res.json())
      .then((data) => {
        const gallery = container.querySelector(".image-gallery");
        gallery.innerHTML = "";
        data.images.forEach((img) => {
          const item = document.createElement("div");
          item.className = "item";

          const imgTag = document.createElement("img");
          imgTag.src = img.url;
          imgTag.alt = img.name;

          imgTag.onclick = (e) => {
            if (e.target.closest(".delete-btn")) return;
            onSelect(img); // 🔥 callback khi click
          };

          const delBtn = document.createElement("button");
          delBtn.className = "delete-btn";
          delBtn.innerHTML = "×";
          delBtn.onclick = async (e) => {
            e.stopPropagation();
            if (!confirm("Bạn có chắc muốn xoá ảnh này?")) return;
            await fetch(`/admin/img/delete/${folder}/${img.name}`, { method: "DELETE" });
            loadImages(folder);
          };

          item.appendChild(imgTag);
          item.appendChild(delBtn);
          gallery.appendChild(item);
        });
      });
  }

  return { init };
})();
