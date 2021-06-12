import {
  FormControl,
  FormLabel,
  Input as ChakraInput,
  InputProps as ChakraInputProps,
} from '@chakra-ui/react';

interface Props extends ChakraInputProps {
  name: string;
  label?: string;
}

export const Input = (props: Props) => {
  const { name, label, ...rest } = props;

  const hasLabel = Boolean(label);

  return (
    <FormControl>
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
        {...rest}
      />
    </FormControl>
  );
};
