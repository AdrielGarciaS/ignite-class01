import logoImg from 'assets/logo.svg'

import { Container, Content } from './styles'

interface Props {
  onOpenNewTransactionModal(): void
}

export const Header = (props: Props) => {
  const { onOpenNewTransactionModal } = props

  return (
    <Container>
      <Content>
        <img src={logoImg} alt="dt money"/>

        <button type="button" onClick={onOpenNewTransactionModal}>
          Nova transação
        </button>
      </Content>
    </Container>
  )
}