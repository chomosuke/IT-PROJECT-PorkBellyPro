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
    "size16": Object {
      "fontSize": "16px",
    },
    "size24": Object {
      "fontSize": "24px",
    },
    "size36": Object {
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
    "caretDoubleLeftBold": Object {
      "$$typeof": Symbol(react.forward_ref),
      "render": [Function],
    },
    "caretDoubleRightBold": Object {
      "$$typeof": Symbol(react.forward_ref),
      "render": [Function],
    },
    "caretDownBold": Object {
      "$$typeof": Symbol(react.forward_ref),
      "render": [Function],
    },
    "caretDownLight": Object {
      "$$typeof": Symbol(react.forward_ref),
      "render": [Function],
    },
    "caretLeftBold": Object {
      "$$typeof": Symbol(react.forward_ref),
      "render": [Function],
    },
    "caretRightBold": Object {
      "$$typeof": Symbol(react.forward_ref),
      "render": [Function],
    },
    "caretUpBold": Object {
      "$$typeof": Symbol(react.forward_ref),
      "render": [Function],
    },
    "floppyDiskBold": Object {
      "$$typeof": Symbol(react.forward_ref),
      "render": [Function],
    },
    "magnifyingGlassLight": Object {
      "$$typeof": Symbol(react.forward_ref),
      "render": [Function],
    },
    "minusCircleBold": Object {
      "$$typeof": Symbol(react.forward_ref),
      "render": [Function],
    },
    "pencilLineBold": Object {
      "$$typeof": Symbol(react.forward_ref),
      "render": [Function],
    },
    "plusCircleBold": Object {
      "$$typeof": Symbol(react.forward_ref),
      "render": [Function],
    },
    "plusCircleLight": Object {
      "$$typeof": Symbol(react.forward_ref),
      "render": [Function],
    },
    "signOutLight": Object {
      "$$typeof": Symbol(react.forward_ref),
      "render": [Function],
    },
    "trashBold": Object {
      "$$typeof": Symbol(react.forward_ref),
      "render": [Function],
    },
    "userCircleBold": Object {
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
      "dropShadow": "2px 4px 4px rgb(0,0,0,0.25)",
    },
  },
}
`);
  });
});
