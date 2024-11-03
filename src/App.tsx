import client from "./lib/client"

export default function App() {
  async function print() {
    const result = await client.get('/ping')
    console.log(result)
  }
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-10">
      <button className="bg-black text-white px-12 py-4 rounded-md" onClick={print}>Print Test</button>
      <input className="border" type="text" />
    </div>
  )
}
