/* eslint-disable @typescript-eslint/no-unused-vars */
import { TextInput, type TextInputProps } from '../form/TextInput';

interface CodeInputProps extends Omit<TextInputProps, 'type'> {
  maxLength?: number;
}

export const CodeInput = ({ maxLength = 8, ...props }: CodeInputProps) => {
  return (
    <TextInput
      {...props}
      type="text"
      className="text-center text-lg tracking-wider font-mono"
    />
  );
};