


export const themeColorText = ` bg-lightbackground dark:bg-darkbackground text-lightText dark:text-darkText `

export const themeText = ` text-lightText dark:text-darkText `

export const themePrimary = 'text-lightPrimary dark:text-darkPrimary'

export const themeBorder = 'border-lightBorder dark:border-darkBorder'

export const themeBackground = 'bg-lightbackground dark:bg-darkbackground ';

export   const getRouteBasedOnRole = userRole => {
    switch (userRole?.toUpperCase()) {
      case 'SALES':
        return 'CreateSales';
      case 'CUSTOMER':
        return 'CreateSales';
      case 'PRODUCTION':
        return 'Production';
      case 'PURCHASE':
        return 'Store';
      case 'ADMIN':
        return 'Dashboard';
      case 'DEVELOPER':
        return 'ManageFinishedGood';
      default:
        console.log('Unknown role, defaulting to Dashboard');
        return 'Dashboard';
    }
  };
