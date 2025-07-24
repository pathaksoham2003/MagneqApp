import { create, useAppColorScheme } from 'twrnc';
import { useState, useEffect } from 'react';

const twLight = create(require(`../tailwind.config.js`)); // light config
const twDark = create(require(`../tailwind.dark.js`));   // dark config

const useTheme = () => {
  // Pass only twLight here once
  const [colorScheme, toggleColorScheme, setColorScheme] = useAppColorScheme(twLight);

  // Store current tw instance in state for rerender on scheme change
  const [tw, setTw] = useState(colorScheme === 'dark' ? twDark : twLight);

  useEffect(() => {
    if (colorScheme === 'dark') setTw(twDark);
    else setTw(twLight);
  }, [colorScheme]);

  return { tw, colorScheme, toggleColorScheme, setColorScheme };
};

export default useTheme;
