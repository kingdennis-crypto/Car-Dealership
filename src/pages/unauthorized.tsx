import useWallet from '@/hooks/useWallet'

export default function Unauthorized() {
  const wallet = useWallet()

  function logInUser() {
    wallet.connectWallet()
  }

  return (
    <>
      <p>Unauthorized</p>
      {!wallet.wallet && <button onClick={logInUser}>Log in</button>}
    </>
  )
}
