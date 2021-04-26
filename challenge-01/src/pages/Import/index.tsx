import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AxiosPromise } from 'axios';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  console.log(uploadedFiles);

  async function handleUpload(): Promise<void> {
    const filesPromises: Promise<AxiosPromise>[] = [];

    uploadedFiles.map(file => {
      const data = new FormData();

      data.append('file', file.file);

      filesPromises.push(
        api.post('/transactions/import', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }),
      );
    });

    try {
      await Promise.all(filesPromises);
    } catch (err) {
      console.log(err.response.error);
    }
  }

  function submitFile(files: File[]): void {
    const uploadFile: FileProps = {
      file: files[0],
      name: files[0].name,
      readableSize: filesize(files[0].size),
    };

    setUploadedFiles([...uploadedFiles, uploadFile]);
    console.log(files);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
