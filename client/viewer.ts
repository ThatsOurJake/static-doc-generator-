type renderTypes = 'image' | 'iframe' | 'json' | 'text' | null;

const renderImage = (fileUrl: string) => {
  const container = document.getElementById('container')!;

  const image = document.createElement('img');
  image.src = fileUrl;

  container.appendChild(image);
};

const renderJSON = (fileUrl: string, fileName: string) => {
  const container = document.getElementById('container')!;

  const KeyValueEle = (key: string, value: string) => {
    const ele = document.createElement('span');

    const keyEle = document.createElement('span');
    keyEle.textContent = key;

    const separator = document.createElement('span');
    separator.textContent = `:`;

    const valueEle = document.createElement('span');
    valueEle.textContent = value;

    ele.append(keyEle, separator, valueEle);

    return ele;
  };

  const DataEle = (key: string, count: number, isArray: boolean) => {
    const ele = document.createElement('span');
    ele.addEventListener('click', () => {
      ele.classList.toggle('json-nested-item-showing');
      ele.parentNode?.querySelectorAll(':scope > .json-nested-item').forEach(x => x.classList.toggle('json-nested-item-show'));
    });
    ele.classList.add('json-nested-item-selector');

    const keyEle = document.createElement('span');
    keyEle.textContent = `${key} {${count}}`;

    if (isArray) {
      keyEle.textContent = `${key} [${count}]`;
    }

    ele.append(keyEle);

    return ele;
  };

  const render = (parentRoot: HTMLElement, key: string, value: {[key: string]: string}[] | {[key: string]: string} | string) => {
    const item = document.createElement('li');
    const root = document.createElement('ul');
    root.classList.add('json-nested-item');
    
    if (Array.isArray(value)) {
      item.appendChild(DataEle(key, value.length, true));

      for (let i = 0; i < value.length; i++) {
        render(root, i.toString(), value[i]);
      }

      item.appendChild(root);
    } else if (typeof value === 'object') {
      item.appendChild(DataEle(key, Object.keys(value).length, false));
      const keys = Object.keys(value);

      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        const v = value[k];
        render(root, k, v);
      }
      
      item.appendChild(root);
    } else {
      item.appendChild(KeyValueEle(key, value));
    }

    parentRoot.appendChild(item);
    return parentRoot;
  }

  fetch(fileUrl, {
    method: 'GET',
  }).then(x => x.json())
  .catch(x => {
    console.error(x);
    return renderUnknown(fileUrl, fileName);
  })
  .then(data => {
    if (!data) {
      return;
    }

    const root = document.createElement('ul');
    root.classList.add('json-viewer');

    const showAllEle = document.createElement('p');
    showAllEle.innerText = 'Show all properties';
    showAllEle.addEventListener('click', () => root.querySelectorAll('.json-nested-item-selector').forEach(x => {
      x.classList.add('json-nested-item-showing');
      x.parentNode?.querySelectorAll(':scope > .json-nested-item').forEach(x => x.classList.add('json-nested-item-show'));
    }));

    const hideAllEle = document.createElement('p');
    hideAllEle.innerText = 'Hide all properties';
    hideAllEle.addEventListener('click', () => root.querySelectorAll('.json-nested-item-selector').forEach(x => {
      x.classList.remove('json-nested-item-showing');
      x.parentNode?.querySelectorAll(':scope > .json-nested-item').forEach(x => x.classList.remove('json-nested-item-show'));
    }));

    container.append(
      showAllEle,
      hideAllEle,
      render(
        root,
        Array.isArray(data) ? 'array' : 'object',
        data)
      );
  });
};

const renderIFrame = (fileUrl: string) => {
  const container = document.getElementById('container')!;

  const iframe = document.createElement('iframe');
  iframe.src = fileUrl;

  container.appendChild(iframe);
};

const renderUnknown = (fileUrl: string, fileName: string) => {
  const container = document.getElementById('container')!;

  const paragraph = document.createElement('p');
  paragraph.innerText = 'File type not supported for viewing: ';

  const downloadLink = document.createElement('a');
  downloadLink.href = fileUrl;
  downloadLink.download = fileName;
  downloadLink.innerText = 'Download';

  paragraph.appendChild(downloadLink);
  container.appendChild(paragraph);
};

const renderText = (fileUrl: string, fileName: string) => {
  const container = document.getElementById('container')!;

  fetch(fileUrl, {
    method: 'GET',
  }).then(x => x.text())
  .catch(x => {
    console.error(x);
    return renderUnknown(fileUrl, fileName);
  })
  .then(data => {
    if (!data) {
      return;
    }

    const root = document.createElement('pre');
    const code = document.createElement('code');
    code.innerText = data;
    root.appendChild(code);
    container.appendChild(root);
  });
};

const determineType = (fileName: string): renderTypes => {
  const fileExt = fileName.split('.').pop();

  switch(fileExt) {
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
      return 'image';
    case 'pdf':
    case 'html':
      return 'iframe';
    case 'json':
      return 'json';
    case 'txt':
    case 'md':
      return 'text';
    default:
      return null;
  }
};

const render = () => {
  const params = new URLSearchParams(window.location.search);
  const file = params.get('file');

  if (!file) {
    return;
  }
  
  const fileName = file.split('/').pop();

  if (!fileName) {
    return;
  }

  window.document.title = `File Viewer - ${fileName}`;
  const fileType = determineType(fileName);

  switch(fileType) {
    case 'image':
      return renderImage(file);
    case 'iframe':
      return renderIFrame(file);
    case 'json':
      return renderJSON(file, fileName);
    case 'text':
      return renderText(file, fileName);
    default:
      return renderUnknown(file, fileName);
  }
};

window.addEventListener('load', render);
