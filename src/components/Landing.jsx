import { useState } from 'react'
export default function Landing(){

    const [count, setCount] = useState(0);
    return(
        <div>
            <h6>Namaste MOM!!!</h6>
            <button onClick={() => setCount((count) => count + 1)}>
                count is {count}
            </button>
        </div>
    )
}