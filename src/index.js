import Post from './Post'
import Json from './assets/json'
import photo from './assets/photo'
import './styles/style'
import './styles/scss.scss'
import './babel'


const post = new Post ('first post, test', photo)
console.log(post)
console.log("json: ", Json)