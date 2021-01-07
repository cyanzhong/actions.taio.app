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
  name: 'Taio Actions',
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
    EditOnGithubPlugin.create('https://github.com/cyanzhong/actions.taio.app/blob/master/docs/', null, path => {
      if (path.indexOf('cn/') === 0) {
        return '在 GitHub 上编辑';
      } else {
        return 'Edit on GitHub';
      }
    }),
    hook => {
      hook.doneEach(() => {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
          const match = link.href.match(/\/docs\/(.+\.json)/);
          if (match) {
            link.onclick = event => {
              event.preventDefault();
              getActions(match[1]);
            }
          }
        });
      });
    }
  ]
};

const iOS = (() => {
  return [
    'iPad Simulator', 'iPhone Simulator', 'iPod Simulator',
    'iPad', 'iPhone', 'iPod',
  ].includes(navigator.platform) || (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
})();

function getActions(name) {
  const type = iOS ? 'raw' : 'blob';
  const url = `https://github.com/cyanzhong/actions.taio.app/${type}/master/docs/${name}`;  
  if (iOS) {
    window.location = `taio://actions?action=import&url=${encodeURIComponent(url)}`;
  } else {
    window.open(url);
  }
}