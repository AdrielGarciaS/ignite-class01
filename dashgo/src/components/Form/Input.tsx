import { forwardRef, ForwardRefRenderFunction } from 'react';
import {
  FormControl,
  FormLabel,
  Input as ChakraInput,
  InputProps as ChakraInputProps,
  FormErrorMessage,
} from '@chakra-ui/react';
import { FieldError } from 'react-hook-form';

interface Props extends ChakraInputProps {
  name: string;
  label?: string;
  error?: FieldError;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, Props> = (
  props,
  ref,
) => {
  const { name, label, error = null, ...rest } = props;

  const hasLabel = Boolean(label);
  const hasError = Boolean(error);

  return (
    <FormControl isInvalid={hasError}>
      {hasLabel && <FormLabel htmlFor={name}>{label}</FormLabel>}

      <ChakraInput
        id={name}
        name={name}
        focusBorderColor="pink.500"
        bgColor="gray.900"
        variant="filled"
        _hover={{
          bgColor: 'gray.900',
        }}
        size="lg"
        ref={ref}
        {...rest}
      />

      {hasError && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

export const Input = forwardRef(InputBase);
