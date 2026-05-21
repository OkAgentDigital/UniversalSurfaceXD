import React from 'react';
import { ThemeProvider, createTheme } from 'flowbite-react';

/**
 * USXD Custom Flowbite Theme
 * Bridges USXD CSS variables to Flowbite React components.
 * Material3 Design — Mono palette, M3 shape tokens.
 * Uses M3 design tokens from m3-tokens.css.
 */
export const usxdFlowbiteTheme = createTheme({
  // ===== BUTTON =====
  button: {
    color: {
      primary: 'bg-usxd-highlight text-usxd-highlight-text hover:brightness-95',
      secondary: 'bg-usxd-surface text-usxd-text border border-usxd-border hover:bg-usxd-background',
      gray: 'bg-usxd-surface text-usxd-text border border-usxd-border hover:bg-usxd-background',
      dark: 'bg-usxd-highlight text-usxd-highlight-text hover:brightness-95',
      light: 'bg-usxd-background text-usxd-text border border-usxd-border hover:bg-usxd-surface',
      success: 'bg-green-600 text-white hover:bg-green-700',
      failure: 'bg-red-600 text-white hover:bg-red-700',
      warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
      info: 'bg-usxd-surface text-usxd-text border border-usxd-border hover:bg-usxd-background',
    },
    size: {
      xs: 'text-xs px-2 py-1',
      sm: 'text-sm px-3 py-1.5',
      md: 'text-base px-4 py-2',
      lg: 'text-lg px-5 py-2.5',
      xl: 'text-xl px-6 py-3',
    },
    pill: {
      off: 'rounded-[var(--m3-shape-button)]',
      on: 'rounded-full',
    } as any,
  },

  // ===== CARD =====
  card: {
    root: {
      base: 'bg-usxd-surface border border-usxd-border rounded-usxd-lg',
      children: 'flex flex-col gap-4 p-4',
    },
  },

  // ===== MODAL =====
  modal: {
    root: {
      base: 'bg-usxd-surface rounded-usxd-lg shadow-none',
      show: {
        on: 'flex bg-black/50',
        off: 'hidden',
      },
      sizes: {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        '5xl': 'max-w-5xl',
        '6xl': 'max-w-6xl',
        '7xl': 'max-w-7xl',
      },
      positions: {
        'top-left': 'items-start justify-start',
        'top-center': 'items-start justify-center',
        'top-right': 'items-start justify-end',
        'center-left': 'items-center justify-start',
        center: 'items-center justify-center',
        'center-right': 'items-center justify-end',
        'bottom-right': 'items-end justify-end',
        'bottom-center': 'items-end justify-center',
        'bottom-left': 'items-end justify-start',
      },
    },
    content: {
      base: 'relative w-full p-6 bg-usxd-surface rounded-usxd-lg',
      inner: 'flex flex-col',
    },
    header: {
      base: 'flex items-start justify-between border-b border-usxd-border pb-4 mb-4',
      title: 'text-lg font-semibold text-usxd-text',
      close: {
        base: 'ml-auto inline-flex items-center rounded-usxd bg-transparent p-1.5 text-usxd-text hover:bg-usxd-background',
        icon: 'h-5 w-5',
      },
    },
    body: {
      base: 'flex-1 overflow-auto text-usxd-text',
    },
    footer: {
      base: 'flex items-center gap-3 border-t border-usxd-border pt-4 mt-4',
    },
  },

  // ===== TEXT INPUT =====
  textInput: {
    field: {
      input: {
        base: 'bg-usxd-background border border-usxd-border text-usxd-text rounded-usxd focus:ring-0 focus:border-usxd-highlight placeholder:text-usxd-secondary',
        colors: {
          gray: 'border-usxd-border bg-usxd-background text-usxd-text',
          info: 'border-usxd-border bg-usxd-background text-usxd-text',
          failure: 'border-red-500 bg-usxd-background text-usxd-text',
          warning: 'border-yellow-500 bg-usxd-background text-usxd-text',
          success: 'border-green-500 bg-usxd-background text-usxd-text',
        },
        withIcon: {
          on: '!pl-10',
          off: '',
        },
        withAddon: {
          on: 'rounded-r-none',
          off: '',
        },
        withShadow: {
          on: 'shadow-sm',
          off: '',
        },
        sizes: {
          sm: 'p-2 text-sm',
          md: 'p-2.5 text-base',
          lg: 'p-4 text-lg',
        },
      },
    },
  },

  // ===== LABEL =====
  label: {
    root: {
      base: 'text-usxd-text font-medium mb-1 block text-sm',
      colors: {
        default: 'text-usxd-text',
        gray: 'text-usxd-secondary',
        green: 'text-green-600',
        red: 'text-red-600',
      },
    },
  },

  // ===== TEXTAREA =====
  textarea: {
    base: 'bg-usxd-background border border-usxd-border text-usxd-text rounded-usxd focus:ring-0 focus:border-usxd-highlight placeholder:text-usxd-secondary',
    colors: {
      gray: 'border-usxd-border bg-usxd-background text-usxd-text',
      info: 'border-usxd-border bg-usxd-background text-usxd-text',
      failure: 'border-red-500 bg-usxd-background text-usxd-text',
      warning: 'border-yellow-500 bg-usxd-background text-usxd-text',
      success: 'border-green-500 bg-usxd-background text-usxd-text',
    },
    withShadow: {
      on: 'shadow-sm',
      off: '',
    },
  },

  // ===== SELECT =====
  select: {
    field: {
      select: {
        base: 'bg-usxd-background border border-usxd-border text-usxd-text rounded-usxd focus:ring-0 focus:border-usxd-highlight',
        colors: {
          gray: 'border-usxd-border bg-usxd-background text-usxd-text',
          info: 'border-usxd-border bg-usxd-background text-usxd-text',
          failure: 'border-red-500 bg-usxd-background text-usxd-text',
          warning: 'border-yellow-500 bg-usxd-background text-usxd-text',
          success: 'border-green-500 bg-usxd-background text-usxd-text',
        },
        withIcon: {
          on: '!pl-10',
          off: '',
        },
        withAddon: {
          on: 'rounded-r-none',
          off: '',
        },
        sizes: {
          sm: 'p-2 text-sm pr-8',
          md: 'p-2.5 text-base pr-8',
          lg: 'p-4 text-lg pr-8',
        },
      },
    },
  },

  // ===== CHECKBOX =====
  checkbox: {
    base: 'h-4 w-4 rounded border-usxd-border bg-usxd-background text-usxd-highlight focus:ring-0 focus:ring-offset-0',
    color: {
      default: 'text-usxd-highlight focus:ring-usxd-highlight',
    },
  },

  // ===== TOGGLE SWITCH =====
  toggleSwitch: {
    toggle: {
      base: 'relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors',
      active: {
        on: 'bg-usxd-highlight',
        off: 'bg-usxd-border',
      },
    },
  },

  // ===== BADGE =====
  badge: {
    root: {
      base: 'inline-flex items-center gap-1 font-medium',
      color: {
        info: 'bg-usxd-surface text-usxd-text border border-usxd-border',
        gray: 'bg-usxd-surface text-usxd-secondary border border-usxd-border',
        failure: 'bg-red-100 text-red-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        indigo: 'bg-usxd-surface text-usxd-text border border-usxd-border',
        purple: 'bg-usxd-surface text-usxd-text border border-usxd-border',
        pink: 'bg-usxd-surface text-usxd-text border border-usxd-border',
      },
      size: {
        xs: 'text-xs px-1.5 py-0.5',
        sm: 'text-sm px-2 py-0.5',
        md: 'text-sm px-2.5 py-1',
        lg: 'text-base px-3 py-1',
        xl: 'text-lg px-4 py-1.5',
      },
    },
  },

  // ===== SPINNER =====
  spinner: {
    base: 'inline-flex items-center justify-center',
    color: {
      failure: 'fill-red-600',
      gray: 'fill-usxd-secondary',
      info: 'fill-usxd-highlight',
      pink: 'fill-pink-600',
      purple: 'fill-purple-600',
      success: 'fill-green-600',
      warning: 'fill-yellow-500',
    },
    size: {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-10 w-10',
    },
  },

  // ===== PROGRESS =====
  progress: {
    base: 'w-full overflow-hidden rounded-full bg-usxd-border',
    bar: 'h-2.5 rounded-full bg-usxd-highlight transition-all duration-300',
    label: 'text-sm font-medium text-usxd-text',
  },

  // ===== TOOLTIP =====
  tooltip: {
    target: 'w-fit',
    base: 'absolute z-10 inline-block rounded-usxd bg-usxd-highlight px-3 py-2 text-xs font-medium text-usxd-highlight-text shadow-none',
    style: {
      dark: 'bg-usxd-highlight text-usxd-highlight-text',
      light: 'bg-usxd-background text-usxd-text border border-usxd-border',
      auto: 'bg-usxd-highlight text-usxd-highlight-text',
    },
    placement: {
      top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
      'top-start': 'bottom-full right-auto mb-2',
      'top-end': 'bottom-full left-auto mb-2',
      right: 'left-full top-1/2 -translate-y-1/2 ml-2',
      'right-start': 'left-full top-auto ml-2',
      'right-end': 'left-full bottom-auto ml-2',
      bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
      'bottom-start': 'top-full right-auto mt-2',
      'bottom-end': 'top-full left-auto mt-2',
      left: 'right-full top-1/2 -translate-y-1/2 mr-2',
      'left-start': 'right-full top-auto mr-2',
      'left-end': 'right-full bottom-auto mr-2',
    },
  },

  // ===== ALERT =====
  alert: {
    base: 'flex items-start gap-3 rounded-usxd-lg p-4 border',
    color: {
      info: 'bg-usxd-surface text-usxd-text border-usxd-border',
      gray: 'bg-usxd-surface text-usxd-secondary border-usxd-border',
      failure: 'bg-red-50 text-red-800 border-red-200',
      success: 'bg-green-50 text-green-800 border-green-200',
      warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    },
    closeButton: {
      base: 'ml-auto -mx-1.5 -my-1.5 rounded-usxd p-1.5 inline-flex items-center justify-center text-usxd-secondary hover:bg-usxd-background',
      icon: 'h-5 w-5',
    },
  },

  // ===== TABS =====
  tabs: {
    base: 'flex flex-col',
    tablist: {
      base: 'flex flex-wrap border-b border-usxd-border',
      styles: {
        default: 'flex-wrap border-b border-usxd-border',
        underline: 'flex-wrap border-b border-usxd-border',
        pills: 'flex-wrap space-x-2',
        fullWidth: 'grid grid-flow-col divide-x divide-usxd-border rounded-none shadow-none',
      },
      tabitem: {
        base: 'flex items-center justify-center rounded-t-lg p-4 text-sm font-medium first:ml-0 focus:outline-none focus:ring-0 disabled:cursor-not-allowed',
        styles: {
          default: {
            base: 'rounded-t-lg',
            active: {
              on: 'bg-usxd-surface text-usxd-highlight border-b-2 border-usxd-highlight',
              off: 'text-usxd-secondary hover:bg-usxd-surface hover:text-usxd-text',
            },
          },
          underline: {
            base: 'rounded-t-lg',
            active: {
              on: 'text-usxd-highlight border-b-2 border-usxd-highlight',
              off: 'text-usxd-secondary hover:text-usxd-text',
            },
          },
          pills: {
            base: '',
            active: {
              on: 'bg-usxd-highlight text-usxd-highlight-text',
              off: 'text-usxd-secondary hover:text-usxd-text',
            },
          },
          fullWidth: {
            base: 'rounded-none',
            active: {
              on: 'bg-usxd-surface text-usxd-highlight',
              off: 'text-usxd-secondary hover:text-usxd-text',
            },
          },
        },
        icon: 'h-5 w-5 mr-2',
      },
    },
    tabpanel: 'p-4',
  },

  // ===== DROPDOWN =====
  dropdown: {
    floating: {
      base: 'z-50 w-fit rounded-usxd-lg border border-usxd-border bg-usxd-surface shadow-none',
      content: 'py-1 text-sm text-usxd-text',
      item: {
        base: 'flex w-full cursor-pointer items-center justify-start px-4 py-2 text-sm text-usxd-text hover:bg-usxd-background',
        icon: 'mr-2 h-4 w-4',
      },
      divider: 'my-1 h-px bg-usxd-border',
      header: 'px-4 py-2 text-sm text-usxd-secondary',
    },
  },

  // ===== NAVBAR =====
  navbar: {
    root: {
      base: 'border-b border-usxd-border bg-usxd-surface px-4 py-2.5',
      inner: {
        base: 'mx-auto flex flex-wrap items-center justify-between',
      },
    },
    brand: {
      base: 'flex items-center',
    },
    collapse: {
      base: 'w-full md:block md:w-auto',
      list: 'mt-4 flex flex-col md:mt-0 md:flex-row md:space-x-8',
    },
    link: {
      base: 'block py-2 pr-4 pl-3 md:p-0 text-usxd-text hover:text-usxd-highlight',
      active: {
        on: 'text-usxd-highlight',
        off: 'text-usxd-secondary',
      },
      disabled: {
        on: 'text-usxd-secondary cursor-not-allowed',
        off: '',
      },
    },
    toggle: {
      base: 'inline-flex items-center rounded-lg p-2 text-sm text-usxd-secondary hover:bg-usxd-background focus:outline-none focus:ring-0 md:hidden',
      icon: 'h-6 w-6 shrink-0',
    },
  },

  // ===== SIDEBAR =====
  sidebar: {
    root: {
      base: 'h-full border-r border-usxd-border bg-usxd-surface',
      inner: 'h-full overflow-y-auto overflow-x-hidden py-2',
    },
    collapse: {
      button: 'group flex w-full items-center rounded-lg p-2 text-base font-normal text-usxd-text hover:bg-usxd-background',
      icon: {
        base: 'h-6 w-6 text-usxd-secondary transition duration-75 group-hover:text-usxd-text',
        open: {
          off: '',
          on: 'rotate-180',
        },
      },
      label: {
        base: 'ml-3 flex-1 whitespace-nowrap text-left',
        icon: {
          base: 'h-5 w-5',
        },
      },
      list: 'space-y-1 py-2',
    },
    cta: {
      base: 'mt-6 rounded-lg bg-usxd-background p-4',
      color: {
        blue: 'bg-usxd-background',
        dark: 'bg-usxd-background',
        failure: 'bg-red-50',
        gray: 'bg-usxd-background',
        green: 'bg-green-50',
        light: 'bg-usxd-background',
        purple: 'bg-purple-50',
        red: 'bg-red-50',
        success: 'bg-green-50',
        warning: 'bg-yellow-50',
      },
    },
    item: {
      base: 'flex items-center justify-center rounded-lg p-2 text-base font-normal text-usxd-text hover:bg-usxd-background',
      active: 'bg-usxd-background text-usxd-highlight',
    },
    items: {
      base: 'space-y-1',
    },
    itemGroup: {
      base: 'space-y-1 border-t border-usxd-border pt-4 first:mt-0 first:border-t-0 first:pt-0',
    },
    logo: {
      base: 'mb-5 flex items-center pl-2.5',
      img: 'mr-3 h-6 sm:h-7',
    },
  },

  // ===== PAGINATION =====
  pagination: {
    base: 'flex items-center gap-1',
    pages: {
      base: 'xs:mt-0 mt-2 inline-flex items-center gap-1',
      showIcon: 'inline-flex items-center',
      previous: {
        base: 'inline-flex items-center justify-center rounded-usxd p-2 text-usxd-secondary hover:bg-usxd-background',
        icon: 'h-5 w-5',
      },
      next: {
        base: 'inline-flex items-center justify-center rounded-usxd p-2 text-usxd-secondary hover:bg-usxd-background',
        icon: 'h-5 w-5',
      },
      selector: {
        base: 'inline-flex items-center justify-center rounded-usxd px-3 py-2 text-sm text-usxd-text hover:bg-usxd-background',
        active: 'bg-usxd-highlight text-usxd-highlight-text hover:bg-usxd-highlight',
      },
    },
  },

  // ===== AVATAR =====
  avatar: {
    root: {
      base: 'flex items-center gap-3',
      bordered: 'ring-2 ring-usxd-border',
      rounded: 'rounded-full',
      img: {
        base: 'object-cover',
        off: 'flex items-center justify-center bg-usxd-surface text-usxd-text font-medium',
      },
      size: {
        xs: 'h-6 w-6 text-xs',
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10 text-base',
        lg: 'h-12 w-12 text-lg',
        xl: 'h-14 w-14 text-xl',
        '2xl': 'h-16 w-16 text-2xl',
      },
      status: {
        base: 'absolute flex items-center justify-center',
        online: 'bg-green-500',
        offline: 'bg-usxd-border',
        away: 'bg-yellow-500',
        busy: 'bg-red-500',
      },
    },
    group: {
      base: 'flex -space-x-2',
    },
  },

  // ===== TABLE =====
  table: {
    root: {
      base: 'w-full text-left text-sm text-usxd-text',
      wrapper: 'relative overflow-x-auto shadow-none',
    },
    head: {
      base: 'bg-usxd-surface text-usxd-secondary text-xs uppercase tracking-wider',
      cell: {
        base: 'px-4 py-3 font-medium',
      },
    },
    body: {
      base: 'divide-y divide-usxd-border',
      cell: {
        base: 'px-4 py-3',
      },
    },
    row: {
      base: 'bg-usxd-background hover:bg-usxd-surface',
      hovered: 'bg-usxd-surface',
      striped: 'odd:bg-usxd-background even:bg-usxd-surface',
    },
  },

  // ===== LIST GROUP =====
  listGroup: {
    root: {
      base: 'list-none rounded-usxd-lg border border-usxd-border bg-usxd-surface text-left text-sm',
    },
    item: {
      base: 'flex items-center gap-3 px-4 py-3 first:rounded-t-lg last:rounded-b-lg border-b border-usxd-border last:border-b-0 text-usxd-text hover:bg-usxd-background',
      active: 'bg-usxd-highlight text-usxd-highlight-text',
      disabled: 'cursor-not-allowed opacity-50',
      icon: 'h-5 w-5',
    },
  },

  // ===== TIMELINE =====
  timeline: {
    root: {
      direction: {
        horizontal: 'sm:flex',
        vertical: 'relative border-l border-usxd-border',
      },
    },
    item: {
      root: {
        horizontal: 'relative mb-6 sm:mb-0',
        vertical: 'mb-10 ml-6',
      },
      point: {
        horizontal: 'flex items-center mb-3',
        vertical: 'absolute -left-3 flex items-center justify-center',
        marker: {
          base: {
            horizontal: 'h-3 w-3 rounded-full border-2 border-usxd-highlight bg-usxd-background',
            vertical: 'h-3 w-3 rounded-full border-2 border-usxd-highlight bg-usxd-background',
          },
          icon: {
            base: 'h-3 w-3 text-usxd-highlight',
            wrapper: 'flex h-3 w-3 items-center justify-center rounded-full bg-usxd-highlight',
          },
        },
        line: 'hidden sm:flex w-full border-t border-usxd-border',
      },
      content: {
        base: 'text-usxd-text',
        time: {
          base: 'mb-1 text-sm font-normal text-usxd-secondary',
        },
        title: {
          base: 'text-lg font-semibold text-usxd-text',
        },
        body: {
          base: 'mb-4 text-base font-normal text-usxd-text',
        },
      },
    },
  },

  // ===== RATING =====
  rating: {
    base: 'flex items-center gap-1',
    star: {
      filled: 'text-yellow-400',
      empty: 'text-usxd-border',
    },
    advanced: {
      base: 'flex items-center gap-2',
      label: 'text-sm font-medium text-usxd-text',
      progress: {
        base: 'h-2 w-48 rounded-full bg-usxd-border',
        fill: 'h-2 rounded-full bg-yellow-400',
        label: 'text-sm font-medium text-usxd-text',
      },
    },
  },

  // ===== ACCORDION =====
  accordion: {
    root: {
      base: 'divide-y divide-usxd-border rounded-usxd-lg border border-usxd-border',
    },
    content: {
      base: 'py-4 px-5 last:rounded-b-lg text-usxd-text',
    },
    title: {
      arrow: {
        base: 'h-5 w-5 shrink-0 text-usxd-secondary',
        open: {
          off: '',
          on: 'rotate-180',
        },
      },
      base: 'flex w-full items-center justify-between px-5 py-4 text-left font-medium text-usxd-text first:rounded-t-lg last:rounded-b-lg',
      flush: {
        off: 'hover:bg-usxd-background',
        on: 'bg-transparent',
      },
      heading: '',
    },
  },

  // ===== CAROUSEL =====
  carousel: {
    root: {
      base: 'relative h-full w-full',
      leftControl: 'absolute top-0 left-0 flex h-full items-center justify-center px-4',
      rightControl: 'absolute top-0 right-0 flex h-full items-center justify-center px-4',
    },
    indicators: {
      active: {
        off: 'bg-usxd-border',
        on: 'bg-usxd-highlight',
      },
      base: 'h-3 w-3 rounded-full',
      wrapper: 'absolute bottom-5 left-1/2 flex -translate-x-1/2 space-x-3',
    },
    item: {
      base: 'absolute top-1/2 left-1/2 block w-full -translate-x-1/2 -translate-y-1/2',
    },
    control: {
      base: 'inline-flex h-8 w-8 items-center justify-center rounded-full bg-usxd-surface text-usxd-text hover:bg-usxd-background',
      icon: 'h-5 w-5',
    },
    scrollContainer: {
      base: 'flex h-full snap-mandatory overflow-y-hidden overflow-x-scroll scroll-smooth rounded-lg',
      snap: 'snap-x',
    },
  },

  // ===== DATE PICKER =====
  datePicker: {
    root: {
      base: 'relative',
    },
    popup: {
      root: {
        base: 'absolute top-10 z-50 block rounded-usxd-lg border border-usxd-border bg-usxd-surface shadow-none',
        inline: 'relative top-0 z-auto',
      },
      header: {
        base: 'flex items-center justify-between px-2 py-2',
        title: 'text-sm font-medium text-usxd-text',
        selectors: {
          base: 'flex items-center gap-1',
          button: {
            base: 'rounded-usxd p-1.5 text-usxd-secondary hover:bg-usxd-background',
            prev: '',
            next: '',
          },
        },
      },
      view: {
        base: 'p-1',
      },
      footer: {
        base: 'flex items-center gap-2 px-3 py-2 border-t border-usxd-border',
        button: {
          base: 'rounded-usxd bg-usxd-highlight px-3 py-1.5 text-sm font-medium text-usxd-highlight-text hover:brightness-95',
          today: 'rounded-usxd border border-usxd-border bg-usxd-surface px-3 py-1.5 text-sm font-medium text-usxd-text hover:bg-usxd-background',
        },
      },
    },
    views: {
      days: {
        header: {
          base: 'mb-1 grid grid-cols-7',
          title: 'h-6 text-center text-xs font-medium text-usxd-secondary',
        },
        items: {
          base: 'grid w-64 grid-cols-7',
          item: {
            base: 'flex h-8 w-8 items-center justify-center rounded-usxd p-1 text-sm text-usxd-text hover:bg-usxd-background',
            selected: 'bg-usxd-highlight text-usxd-highlight-text hover:bg-usxd-highlight',
            disabled: 'text-usxd-border',
          },
        },
      },
      months: {
        items: {
          base: 'grid w-64 grid-cols-4',
          item: {
            base: 'flex h-12 w-full items-center justify-center rounded-usxd p-2 text-sm text-usxd-text hover:bg-usxd-background',
            selected: 'bg-usxd-highlight text-usxd-highlight-text hover:bg-usxd-highlight',
            disabled: 'text-usxd-border',
          },
        },
      },
      years: {
        items: {
          base: 'grid w-64 grid-cols-4',
          item: {
            base: 'flex h-12 w-full items-center justify-center rounded-usxd p-2 text-sm text-usxd-text hover:bg-usxd-background',
            selected: 'bg-usxd-highlight text-usxd-highlight-text hover:bg-usxd-highlight',
            disabled: 'text-usxd-border',
          },
        },
      },
      decades: {
        items: {
          base: 'grid w-64 grid-cols-4',
          item: {
            base: 'flex h-12 w-full items-center justify-center rounded-usxd p-2 text-sm text-usxd-text hover:bg-usxd-background',
            selected: 'bg-usxd-highlight text-usxd-highlight-text hover:bg-usxd-highlight',
            disabled: 'text-usxd-border',
          },
        },
      },
    },
  },

  // ===== FILE INPUT =====
  fileInput: {
    base: 'block w-full cursor-pointer rounded-usxd border border-usxd-border bg-usxd-background text-sm text-usxd-text file:-ms-4 file:me-4 file:cursor-pointer file:border-none file:bg-usxd-highlight file:py-2.5 file:pe-4 file:ps-8 file:text-sm file:font-medium file:leading-[inherit] file:text-usxd-highlight-text hover:file:brightness-95',
    colors: {
      gray: 'border-usxd-border bg-usxd-background text-usxd-text',
      info: 'border-usxd-border bg-usxd-background text-usxd-text',
      failure: 'border-red-500 bg-usxd-background text-usxd-text',
      warning: 'border-yellow-500 bg-usxd-background text-usxd-text',
      success: 'border-green-500 bg-usxd-background text-usxd-text',
    },
    sizes: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-lg',
    },
  },

  // ===== KBD =====
  kbd: {
    root: {
      base: 'rounded-usxd border border-usxd-border bg-usxd-surface px-2 py-1.5 text-xs font-semibold text-usxd-text',
    },
  },

  // ===== MEGA MENU =====
  megaMenu: {
    dropdown: {
      base: 'absolute z-10 left-0 top-full w-screen max-w-md rounded-usxd-lg border border-usxd-border bg-usxd-surface shadow-none',
    },
  },
});

interface FlowbiteThemeProviderProps {
  children: React.ReactNode;
}

export const FlowbiteThemeProvider: React.FC<FlowbiteThemeProviderProps> = ({ children }) => {
  return (
    <ThemeProvider theme={usxdFlowbiteTheme}>
      {children}
    </ThemeProvider>
  );
};

export default FlowbiteThemeProvider;
