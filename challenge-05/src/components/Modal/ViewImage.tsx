import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bgColor="pGray.800" w="max" h="max" maxW={900} maxH={600}>
        <ModalBody p={0}>
          <Image
            src={imgUrl}
            alt="Image"
            borderTopRadius="md"
            maxW={900}
            maxH={600}
          />
        </ModalBody>
        <ModalFooter
          display="flex"
          justifyContent="flex-start"
          py="0.5rem"
          px="0.625rem"
          bgColor="pGray.800"
        >
          <Link href={imgUrl} target="_blank">
            Abrir original
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
