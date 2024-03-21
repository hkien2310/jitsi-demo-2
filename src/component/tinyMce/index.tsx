import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import ButtonCommon from '../Button';
const unsignedUploadPreset = 'adz8s31b';

function Tiny({ setContent, isEdit, item }) {
  const [state, setState] = React.useState({
    content: '',
    saved: false,
    post: {
      description: '',
    },
    urlImage: '',
    loading: false,
  });
  const _handleEditorChange = (e) => {
    setState({ ...state, content: e.target.getContent() });
  };

  const _handSave = () => {
    //Let push state.content which you got to server
    //can view result at console window :)
    setState({ ...state, saved: true });
    setContent(state.content);
  };

  React.useEffect(() => {
    const input = document.getElementsByTagName('input');
    if (state.loading && input) {
      input.disabled = true;
    } else if (!state.loading && input) {
      input.disabled = false;
    }
  });

  document.addEventListener('focusin', (e) => {
    if (e.target.closest('.tox-tinymce-aux, .moxman-window, .tam-assetmanager-root') !== null) {
      e.stopImmediatePropagation();
    }
  });

  const urlUpload = 'https://localhost:7072/api/ImageUpload';

  return (
    <div className="App">
      <div style={{ width: '100%' }}>
        <Editor
          apiKey={`0l9ca7pyz0qyliy0v9mmkfl2cz69uodvc8l6md8o4cnf6rnc`}
          initialValue={item?.content}
          init={{
            height: 600,
            menubar: true,
            config: {},
            language: 'vi',
            selector: 'textarea',
            // skin: 'oxide-dark',
            content_css: 'light',
            images_upload_base_path: urlUpload,
            images_upload_credentials: true,
            plugins: [
              'advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table paste code help wordcount',
            ],
            toolbar: `undo redo| link code image | formatselect | bold italic backcolor | \
                alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | removeformat | help`,
            image_title: true,
            automatic_uploads: true,
            file_picker_types: 'image',
            file_picker_callback: function (cb, value, meta) {
              const input = document.createElement('input');
              input.setAttribute('type', 'file');
              input.setAttribute('accept', 'image/*');
              const url = urlUpload;
              const xhr = new XMLHttpRequest();
              const fd = new FormData();
              xhr.open('POST', url, true);

              input.onchange = function () {
                const file = this.files[0];
                fd.append('files', file);
                const reader = new FileReader();

                xhr.onload = function () {
                  if (xhr.readyState === 4 && xhr.status === 200) {
                    // File uploaded successfully
                    const response = xhr.responseText;
                    // https://res.cloudinary.com/cloudName/image/upload/v1483481128/public_id.jpg
                    // const url = `https://localhost:7072/api${response}`;

                    const url = `localhost:7072/wwwroot/images/1a741d22efb41fea46a5.jpg`;
                    // console.log(url)
                    // Create a thumbnail of the uploaded image, with 150px width
                    cb(response, { title: response });
                  }
                };

                reader.onload = function () {
                  const id = 'blobid' + new Date().getTime();
                  const blobCache = window.tinymce.activeEditor.editorUpload.blobCache;
                  const base64 = reader.result.split(',')[1];

                  const blobInfo = blobCache.create(id, file, base64);
                  blobCache.add(blobInfo);

                  // call the callback and populate the Title field with the file name

                  fd.append('upload_preset', unsignedUploadPreset);
                  fd.append('tags', 'browser_upload');
                  fd.append('file', blobInfo.blob(), blobInfo.filename());

                  xhr.send(fd);
                };

                reader.readAsDataURL(file);
              };

              input.click();
            },
          }}
          onChange={_handleEditorChange}
        />
        <div style={{ marginTop: '10px' }}>
          <ButtonCommon onClick={_handSave}>Lưu mô tả</ButtonCommon>
        </div>
      </div>
    </div>
  );
}

export default Tiny;