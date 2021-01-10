const iOS = [
  'iPad Simulator', 'iPhone Simulator', 'iPod Simulator',
  'iPad', 'iPhone', 'iPod',
].includes(navigator.platform) || (navigator.userAgent.includes('Mac') && 'ontouchend' in document);

localizePageTitle(location.href.indexOf('/#/cn/') !== -1);

window.$docsify = {
  themeColor: '#007AFF',
  alias: {
    '/((?!cn).)*/_sidebar.md': '/_sidebar.md',
    '/((?!cn).)*/_navbar.md': '/_navbar.md',
    '/cn/.*/_sidebar.md': '/cn/_sidebar.md',
    '/cn/.*/_navbar.md': '/cn/_navbar.md'
  },
  auto2top: true,
  coverpage: false,
  executeScript: true,
  loadSidebar: true,
  loadNavbar: true,
  mergeNavbar: true,
  maxLevel: 4,
  subMaxLevel: 2,
  name: 'Taio',
  search: {
    noData: {
      '/cn/': '没有结果',
      '/': 'No results'
    },
    paths: 'auto',
    placeholder: {
      '/cn/': '搜索',
      '/': 'Search'
    }
  },
  formatUpdated: '{MM}/{DD} {HH}:{mm}',
  plugins: [
    EditOnGithubPlugin.create('', null, path => {
      if (path.indexOf('cn/') === 0) {
        return '在 GitHub 上编辑';
      } else {
        return 'Edit on GitHub';
      }
    }),
    (hook, vm) => {
      hook.doneEach(() => {
        const path = vm.route.path;
        const cn = path.indexOf('/cn/') !== -1;
        localizePageTitle(cn);

        const editButton = document.querySelector('a[onclick^="EditOnGithubPlugin"]');
        if (editButton) {
          editButton.onclick = event => {
            const link = 'https://github.com/cyanzhong/actions.taio.app/edit/master/docs/' + vm.route.file;
            window.open(link)
            event.preventDefault();
          }
        }

        const links = document.querySelectorAll('a');
        links.forEach(link => {
          const match = link.href.match(/\/docs\/(.+\.json)/);
          if (match) {
            const name = match[1];
            link.className = 'rounded_button';
            link.onclick = event => {
              event.preventDefault();
              getActions(name);
            }

            if (!iOS) {
              const space = document.createElement('span');
              space.innerHTML = '&nbsp;&nbsp;';

              const a = document.createElement('a');
              a.href = '';
              a.className = 'rounded_button';

              const updateTitle = isHidden => {
                if (isHidden) {
                  a.textContent = cn ? '显示二维码' : 'Show QR Code';
                } else {
                  a.textContent = cn ? '隐藏二维码' : 'Hide QR Code';
                }
              }

              a.onclick = event => {
                event.preventDefault();
                updateTitle(toggleQRCode(name, link.parentNode.nextSibling));
              }

              updateTitle(true);
              link.parentNode.insertBefore(space, link.nextSibling);
              space.parentNode.insertBefore(a, space.nextSibling);
            }
          }
        });
      });
    }
  ]
};

function repoURL(type, name) {
  return `https://github.com/cyanzhong/actions.taio.app/${type}/master/docs/${name}`;
}

function importURL(url) {
  return `taio://actions?action=import&url=${encodeURIComponent(url)}`;
}

function getActions(name) {
  const type = iOS ? 'raw' : 'blob';
  const url = repoURL(type, name);
  if (iOS) {
    window.location = importURL(url);
  } else {
    window.open(url);
  }
}

function toggleQRCode(name, node) {
  if (node instanceof HTMLImageElement) {
    node.parentNode.removeChild(node);
    return true;
  }

  const qrcode = new QRious();
  qrcode.value = importURL(repoURL('raw', name));

  const img = document.createElement('img');
  img.src = qrcode.toDataURL();
  node.parentNode.insertBefore(img, node);
  return false;
}

function localizePageTitle(cn) {
  const titles = {
    en: 'Taio Actions',
    cn: 'Taio 动作',
  }

  if (cn) {
    if (document.title === titles.en) {
      document.title = titles.cn;
    }
  } else {
    if (document.title === titles.cn) {
      document.title = titles.en;
    }
  }
}