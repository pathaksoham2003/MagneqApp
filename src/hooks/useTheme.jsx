// useTheme.js
import { useAppColorScheme } from 'twrnc';
import { useState } from 'react';
import tw from '../utils/tw';

export default function useTheme() {
  const [colorScheme, toggleColorScheme, setColorScheme] = useAppColorScheme(tw);

  return { tw, colorScheme, toggleColorScheme, setColorScheme };
}
