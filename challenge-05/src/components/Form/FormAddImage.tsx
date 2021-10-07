import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import * as yup from 'yup';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageData {
  title: string;
  description: string;
  image: FileList;
}

interface CreateImageData {
  title: string;
  description: string;
  url: string;
}

interface FormAddImageProps {
  closeModal: () => void;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = yup.object({
    image: yup
      .mixed()
      .required('Image é obrigatória')
      .test('file-size', 'A imagem pode conter no máximo 10MB', value => {
        const maxSize10mb = 10 * 1024 * 1024;
        return value && value.length && value[0].size <= maxSize10mb;
      }),
    title: yup
      .string()
      .min(2, 'Mínimo de 2 caracteres')
      .max(20, 'Máximo de 20 caracteres')
      .required('Título obrigatório'),
    description: yup
      .string()
      .required('Campo obrigatório')
      .max(65, 'Máximo de 65 caracteres'),
  });

  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation(
    async (data: CreateImageData) => api.post('/images', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('images');
      },
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm<FormAddImageData>({
      resolver: yupResolver(formValidations),
    });
  const { errors } = formState;

  const onSubmit = async (data: FormAddImageData): Promise<void> => {
    try {
      if (!imageUrl) {
        toast({
          title: 'Imagem não adicionada',
          description:
            'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
          status: 'error',
          isClosable: true,
        });

        return;
      }
      const response = await mutateAsync({
        title: data.title,
        description: data.description,
        url: imageUrl,
      });

      if (!response.data.success) {
        toast({
          title: 'Falha no cadastro',
          description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.',
          status: 'error',
          isClosable: true,
        });

        return;
      }

      toast({
        title: 'Imagem cadastrada',
        description: 'Sua imagem foi cadastrada com sucesso.',
        status: 'success',
        isClosable: true,
      });
      reset();
      closeModal();
    } catch (error) {
      toast({
        title: 'Erro',
        description: error.message,
        status: 'error',
        isClosable: true,
      });
    } finally {
      queryClient.fetchQuery('images');
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          error={errors?.image}
          {...register('image')}
        />

        <TextInput
          placeholder="Título da imagem..."
          error={errors?.title}
          {...register('title')}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          error={errors?.description}
          {...register('description')}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
