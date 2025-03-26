// app.config.ts
export default defineAppConfig({
  ui: {
    // Set primary color to indigo based on design screenshots
    primary: 'indigo',
    gray: 'slate',
    
    // Strategy to ensure our settings extend the defaults rather than replace them
    strategy: 'merge',
    
    // Dark mode specific configs
    dark: true,
    
    // Button styling to match the design
    button: {
      default: {
        size: 'md',
        color: 'indigo',
        variant: 'solid',
      },
      rounded: 'rounded-lg',
      font: 'font-medium',
      size: {
        '2xs': 'text-xs px-3 py-1',
        'xs': 'text-xs px-3.5 py-1.5',
        'sm': 'text-sm px-4 py-2',
        'md': 'text-sm px-5 py-2.5',
        'lg': 'text-base px-6 py-3',
        'xl': 'text-base px-7 py-3.5',
      },
      // Customizing variants for better appearance
      variant: {
        solid: 'text-white dark:text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:disabled:bg-indigo-700/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-{color}-500 dark:focus-visible:outline-{color}-400',
        ghost: 'text-{color}-600 dark:text-{color}-400 hover:bg-{color}-50 dark:hover:bg-{color}-900 disabled:bg-transparent dark:disabled:bg-transparent',
      },
    },
    
    // Card styling to match design screenshots
    card: {
      rounded: 'rounded-lg',
      shadow: 'shadow-sm',
      header: {
        padding: 'px-4 py-5 sm:px-6',
      },
      body: {
        padding: 'p-4 sm:p-6',
      },
      footer: {
        padding: 'px-4 py-4 sm:px-6',
      },
      background: 'bg-white dark:bg-gray-900',
      border: 'border border-gray-200 dark:border-gray-800',
      divide: 'divide-y divide-gray-200 dark:divide-gray-800',
    },
    
    // Form inputs styling
    input: {
      default: {
        size: 'xl',
        color: 'indigo',
      },
      rounded: 'rounded-lg',
      size: {
        'sm': 'text-sm px-3 py-2',
        'md': 'text-sm px-4 py-2.5',
        'lg': 'text-base px-5 py-3',
        'xl': 'text-base px-6 py-3.5',
      },
      color: {
        white: {
          outline: 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-2 border-indigo-600 dark:border-indigo-500 focus:border-{color}-700 dark:focus:border-{color}-400 focus:ring-1 focus:ring-{color}-500 dark:focus:ring-{color}-400'
        }
      },
      variant: {
        outline: 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-2 border-indigo-600 dark:border-indigo-500 focus:border-{color}-700 dark:focus:border-{color}-400 focus:ring-1 focus:ring-{color}-500 dark:focus:ring-{color}-400'
      }
    },
    
    // Alert styling for stoppers/tips
    alert: {
      default: {
        color: 'indigo',
      },
      padding: 'px-4 py-3',
      rounded: 'rounded-md',
      color: {
        indigo: {
          solid: 'bg-indigo-500 dark:bg-indigo-600 text-white',
          subtle: 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300',
          outline: 'border border-indigo-500 dark:border-indigo-400 text-indigo-700 dark:text-indigo-300'
        }
      }
    },
    
    // FormGroup styling for labels and spacing
    formGroup: {
      wrapper: 'space-y-2 mb-4',
      label: {
        wrapper: 'flex justify-between',
        base: 'block text-sm font-medium text-gray-700 dark:text-gray-200',
        required: 'text-red-500 dark:text-red-400',
      },
      description: 'text-gray-500 dark:text-gray-400 text-sm',
      hint: 'text-gray-500 dark:text-gray-400 text-sm',
      error: 'text-red-500 dark:text-red-400 text-sm',
    },
    
    // Select component styling
    select: {
      default: {
        size: 'xl',
        color: 'indigo',
      },
      wrapper: 'relative',
      base: 'relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0',
      rounded: 'rounded-lg',
      placeholder: 'text-gray-400 dark:text-gray-500',
      container: 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-2 border-indigo-600 dark:border-indigo-500',
      size: {
        'sm': 'text-sm px-3 py-2',
        'md': 'text-sm px-4 py-2.5',
        'lg': 'text-base px-5 py-3',
        'xl': 'text-base px-6 py-3.5',
      },
    },
    
    // Textarea styling to match inputs
    textarea: {
      default: {
        size: 'xl',
        color: 'indigo',
      },
      rounded: 'rounded-lg',
      size: {
        'sm': 'text-sm px-3 py-2',
        'md': 'text-sm px-4 py-2.5',
        'lg': 'text-base px-5 py-3',
        'xl': 'text-base px-6 py-3.5',
      },
      color: {
        white: {
          outline: 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-2 border-indigo-600 dark:border-indigo-500 focus:border-{color}-700 dark:focus:border-{color}-400 focus:ring-1 focus:ring-{color}-500 dark:focus:ring-{color}-400'
        }
      },
    },

    // Checkbox component styling
    checkbox: {
      wrapper: 'relative flex items-start',
      base: 'h-5 w-5 dark:bg-gray-900 dark:border-gray-700 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-indigo-600 dark:text-indigo-500',
      rounded: 'rounded-md',
      label: 'font-medium text-gray-700 dark:text-gray-200 ml-2',
      required: 'text-red-500 dark:text-red-400',
    },
    
    // Radio component styling
    radio: {
      wrapper: 'relative flex items-center',
      base: 'h-5 w-5 dark:bg-gray-900 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-indigo-600 dark:text-indigo-500',
      rounded: 'rounded-full',
      label: 'font-medium text-gray-700 dark:text-gray-200 ml-2',
      required: 'text-red-500 dark:text-red-400',
      default: {
        color: 'indigo'
      }
    }
  }
})
