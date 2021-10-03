import { defaultTheme } from '../theme';

describe('theme unit tests', () => {
  test('defaultTheme match', () => {
    expect(defaultTheme).toMatchInlineSnapshot(`
Object {
  "fontFamily": Object {
    "roboto": Object {
      "fontFamily": "Roboto, sans-sarif",
    },
    "ubuntu": Object {
      "fontFamily": "Ubuntu, sans-serif",
    },
  },
  "fontSize": Object {
    "small": Object {
      "fontSize": "16px",
    },
    "standard": Object {
      "fontSize": "24px",
    },
    "title": Object {
      "fontSize": "36px",
    },
  },
  "fontWeight": Object {
    "black": Object {
      "fontWeight": "900",
    },
    "bold": Object {
      "fontWeight": "700",
    },
    "light": Object {
      "fontWeight": "100",
    },
    "medium": Object {
      "fontWeight": "400",
    },
  },
  "icon": Object {
    "caretDoubleLeft": Object {
      "$$typeof": Symbol(react.forward_ref),
      "render": [Function],
    },
    "caretDoubleRight": Object {
      "$$typeof": Symbol(react.forward_ref),
      "render": [Function],
    },
    "caretDown": Object {
      "$$typeof": Symbol(react.forward_ref),
      "render": [Function],
    },
    "caretLeft": Object {
      "$$typeof": Symbol(react.forward_ref),
      "render": [Function],
    },
    "caretRight": Object {
      "$$typeof": Symbol(react.forward_ref),
      "render": [Function],
    },
    "caretUp": Object {
      "$$typeof": Symbol(react.forward_ref),
      "render": [Function],
    },
    "cross": Object {
      "$$typeof": Symbol(react.forward_ref),
      "render": [Function],
    },
    "folderOpen": Object {
      "$$typeof": Symbol(react.forward_ref),
      "render": [Function],
    },
    "magnifyingGlass": Object {
      "$$typeof": Symbol(react.forward_ref),
      "render": [Function],
    },
    "minusCircle": Object {
      "$$typeof": Symbol(react.forward_ref),
      "render": [Function],
    },
    "pencilLine": Object {
      "$$typeof": Symbol(react.forward_ref),
      "render": [Function],
    },
    "plusCircle": Object {
      "$$typeof": Symbol(react.forward_ref),
      "render": [Function],
    },
    "plusCircleTag": Object {
      "$$typeof": Symbol(react.forward_ref),
      "render": [Function],
    },
    "signOut": Object {
      "$$typeof": Symbol(react.forward_ref),
      "render": [Function],
    },
    "tick": Object {
      "$$typeof": Symbol(react.forward_ref),
      "render": [Function],
    },
    "trash": Object {
      "$$typeof": Symbol(react.forward_ref),
      "render": [Function],
    },
    "userCircle": Object {
      "$$typeof": Symbol(react.forward_ref),
      "render": [Function],
    },
  },
  "palette": Object {
    "cloudyDay": "#c7c7c7",
    "darkDenim": "#1a3240",
    "deepSlate": "#5e5e5e",
    "everblue": "#2f5972",
    "justWhite": "#ffffff",
    "moldyCheese": "#8c99a1",
    "quartz": "#f8f8f8",
    "sootyBee": "#0f0d0d",
    "stoneBlue": "#627b8a",
  },
  "shape": Object {
    "default": Object {
      "borderRadius": "8px",
      "boxShadow": "2px 4px 4px rgb(0,0,0,0.25)",
    },
  },
}
`);
  });
});
