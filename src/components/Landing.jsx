export default function Landing(){

    
    return(
        <div>
            <div class='container-fluid text-center position-absolute top-0 start-0'>
            <h1>Welcome to Boston Dumplings</h1>
            </div>
            <div class='container-fluid d-flex justify-content-around'>
                <div class='p-4 g-3'>Image</div>
                <div class='p-4'>Image1</div>
                <div class='p-4'>Image2</div>
            </div>
            <form action="" method='post' class='grid gap-3'>
                <div class='nameInput p-2 g-col-6'>
                    <label htmlFor="name">Enter your name: </label>
                    <input type="text" name='name' id='name' class='form-control' required/>
                </div>
                <div class='phoneNumber p-2 g-col-6'>
                    <label htmlFor="phone-number">Enter your phone number: </label>
                    <input type="text" name="phone-number" id='phone-number' class='form-control' required />
                </div>
                <div class='comment mb-3 p-2 g-col-6'>
                    <label class='' htmlFor="comment">Comment: </label>
                    <textarea name="form-control"  id="floatingTextarea2" rows='9'></textarea>
                </div>
                <div>
                    <button type='button' className='btn btn-success'>Submit</button>
                </div>
            </form>
        </div>
    )
}