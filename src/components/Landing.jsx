import { useState } from 'react'
export default function Landing(){

    const [count, setCount] = useState(0);
    return(
        <div>
            <h1>Welcome to Boston Dumplings</h1>
            <button onClick={() => setCount((count) => count + 1)}>
                count is {count}
            </button>
            <form action="" method='post'>
                <div class='nameInput'>
                    <label htmlFor="name">Enter your name: </label>
                    <input type="text" name='name' id='name' required/>
                </div>
                <div class='emailInput'>
                    <label htmlFor="email">Enter your email: </label>
                    <input type="email" name="email" id='email' required />
                </div>
                <div class='comment'>
                    <label htmlFor="comment">Comment</label>
                    <input type="text" name='comment' id='comment'/> 
                </div>
                <div>
                    <button>Submit</button>
                </div>
            </form>
        </div>
    )
}