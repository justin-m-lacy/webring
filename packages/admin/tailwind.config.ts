import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette';
import plugin from 'tailwindcss/plugin';

/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */
export default {

  content: ['./src/**/*.{vue,js,ts,jsx,tsx,html}', 'index.html'],
  theme: {


    fontFamily: {
    },
    extend: {

      gridTemplateColumns: {
        'fill-150': 'repeat(auto-fill, minmax(100px, 150px))'
      },
      gridTemplateRows: {
        'grid-template': 'repeat(auto-fill, minmax(1fr, 1fr))'
      },
      keyframes: {

        blink: {
          '0%,100%': {
            opacity: 1
          },
          '20%,50%': {
            opacity: 0
          },
          '19%,51%': {
            opacity: 1
          }
        },
        ping: {

          '70%': {
            transform: 'scale(1.15)',
            opacity: 0.5
          },
          '100%': {
            transform: 'scale(1.0)',
            opacity: 1
          }
        }

      },
      animation: {
        blink: 'blink 1.75s linear reverse infinite',
        flicker: 'flicker 1.5s linear',
        throb: 'throb 1.65s cubic-bezier(0.4,0,0.6,1) infinite',
        'ping-sm': 'ping 1s cubic-bezier(0, 0, 0.2, 1) reverse infinite'
      },

      spacing: {
        'xs': '0.2rem',
        'sm': '0.32rem',
        'md': '0.65rem'
      },
      borderWidth: {
        md: 10.5,
        lg: "12px"
      },

      blur: {
        line: '1px'
      },
      colors: {
      },
      fontSize: {

        xxs: '0.5rem',
        xs: '0.7rem',
        md: '0.9rem',
        big: "2rem",
        subtitle: "1.375rem",
        title: "1.75rem",  // 28px
        // 22px
      },
      height: {
        line: '0.0625rem',
        xs: '2px',
        dialog: 771,
        lg: 686,
        xl: 850,
        "13": 52,
        "23": 92,
        "25": 100,
        "78": 312,

      },
      lineHeight: {
        'snug': 1.375
      },
      zIndex: {
        100: 100,
        mask: 101,
        dialog: 1000
      },
      translate: {
        min: 1
      },
      transitionDuration: {
        '2000': '2s',
        '3000': '3s',
        '5000': '5s',
      },
      borderRadius: {
        'xs': '1px',
        'lg': '0.45rem',
        "xxl": "72px"
      },
      gap: {
        "sm": 5.5,
      },


      dropShadow: {
      },

      padding: {
        "4.5": "1.125rem",
      },
      margin: {
        "2.5": 10,
        "4.5": "1.125rem",
        "7.5": "1.975rem",
        "10.5": 42,
        "15": 60,
        "31": 124,

      },

      minWidth: {
        "10": 40,
        "51": 204,
        sm: 241,
        "section": 414,
        "button-md": 80,
      },
      width: {
        "4.5": "1.125rem",
        "13": 52,
        "25": 100,
        "92": 366,
        section: 414,
        "md": 704,
        "xl": 1046
      },
      maxWidth: {
        section: 414,
        xl: 1046,
        lg: 704,
        sm: 241,
        md: 387,
      },
      minHeight: {
        title: 80,
        sm: 100,
        md: 256,
        lg: 686,
        xl: 1024
      },
      maxHeight: {
        "dialog-sm": 257,
        "dialog-lg": 663,
        lg: 686,
        xl: 850,
        dialog: 771,
      },

      neonGlowSize: {
        xs: '0.015em',
        sm: '0.03em',
        md: '2px',
        lg: '4px'
      },


    },
  },
  plugins: [

    plugin(({ matchUtilities, theme }) => {

      matchUtilities({

        'throb-on': (value) => ({
          '--throb-on-color': value
        }), 'throb-off': (value) => ({
          '--throb-off-color': value
        }),


      }, {
        respectPrefix: false,
        values: flattenColorPalette(theme('colors')),
        type: 'color',
      });

    }),

    plugin(({ addComponents, theme }) => {

      addComponents({

        '.btn-sm': {
          'min-width': '5em',
          'max-width': '8em',
          'min-height': '0.5em',
          'padding': `1px ${theme('padding.1')}`,
          '&:disabled': {
            opacity: '0.5',

          }
        }
      }),

        addComponents({

          '.btn': {
            'min-width': '8em',
            'max-width': '16em',
            'min-height': '0.5em',
            'padding': `1px ${theme('padding.1')}`,
            '&:disabled': {
              opacity: '0.5',

            }
          }
        })

    }),


  ],
};
