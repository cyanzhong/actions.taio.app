const iOS = (() => {
  return [
    'iPad Simulator', 'iPhone Simulator', 'iPod Simulator',
    'iPad', 'iPhone', 'iPod',
  ].includes(navigator.platform) || (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
})();

localizePageTitle(location.href.indexOf('/#/cn/') !== -1);

window.$docsify = {
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
            link.onclick = event => {
              event.preventDefault();
              getActions(name);
            }

            if (!iOS) {
              const span = document.createElement('span');
              const title = cn ? '二维码' : 'QR Code';
              span.innerHTML = `&nbsp;&nbsp;<a href='' onclick='event.preventDefault();showQRCode("${name}")'>${title}</a>`;
              link.parentNode.insertBefore(span, link.nextSibling);
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

function showQRCode(name) {
  const url = importURL(repoURL('raw', name));
  const qrcode = new QRious();
  qrcode.value = url;

  const newTab = window.open();
  newTab.document.title = url;
  newTab.document.body.innerHTML = `<img src='${qrcode.toDataURL()}'>`;
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