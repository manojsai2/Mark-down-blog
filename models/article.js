const mongoose =require('mongoose')
const {marked} =require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const window = new JSDOM('').window;
const DOMPurify = createDomPurify(window);





const articleSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String
    },
    markdown:{
        type: String

    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitizedHtml: {
        type: String,
        default: ''        
    }
})

articleSchema.pre('validate', function(next){
    if(this.title){
        this.slug = slugify(this.title, { lower: true, strict: true})
    }

    console.log(this.markdown)

    
    try {

        if (this.markdown) {
            
            const markdownHtml = marked((this.markdown).toString(), { mangle: false, headerIds: true,sanitize: true });
            console.log(markdownHtml)
            this.sanitizedHtml = DOMPurify.sanitize(markdownHtml,{sanitize: true});
           console.log(this.sanitizedHtml)
        }
    } catch (err) {
        console.error("Error converting Markdown to HTML:", err);
    }
    

    
    next()
})

module.exports = mongoose.model('Article', articleSchema)
// const {marked} = require('marked');
// const createDOMPurify = require('dompurify');
// const { JSDOM } = require('jsdom');

// const window = new JSDOM('').window;
// const DOMPurify = createDOMPurify(window);

// const markdown = '# Hello, Markdown!';
// const markdownHtml = marked(markdown, { mangle: false, headerIds: false });
// console.log(markdownHtml);
// const sanitizedHtml = DOMPurify.sanitize(markdownHtml);

// console.log(sanitizedHtml);
