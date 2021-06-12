let profilePhoto = document.querySelector('#profilePhoto')
let followBtn = document.querySelector('#followBtn')
let followersBtn = document.querySelector('#followersBtn')

profilePhoto.addEventListener('change',async (e) => {
   if(e.target.files.length){
   	let formData = new FormData()
   	formData.append('photo' , e.target.files[0])
   	let res = await fetch('profile/photo' , {
   		method:'POST',
   		body: formData
   	})
   	res = await res.json()
   	if(res.ok){
   		window.location.reload()
   	} else{
   		alert(`Error`)
   	}
   }
})

followersBtn.addEventListener('click', async (evn)=>{
   let username = evn.target.getAttribute('data-username')
   try {
      let res = await fetch(`profile/followers?` + 'username=' + username)
      res = await res.json()
      console.log(res);
   } catch(e) {
   }
})

if(followBtn){
followBtn.addEventListener('click',async (evn) =>{
  let username = evn.target.getAttribute('data-username')
 try {
    let res = await fetch('./follow' , {
      method:'POST',
      headers:{
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({
         username:username
      })
    })
    res = await res.json()
 if(res.ok){
   evn.target.classList.toggle('btn-primary')
   evn.target.classList.toggle('btn-secondary')
   res.followOld ? evn.target.textContent = 'Follow' : evn.target.textContent = 'Unfollow'
 } 
 } catch(e) {
    console.log(e);
 }
})
}
