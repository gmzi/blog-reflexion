import {text} from '../../lib/data';

export default function MetadataForm({handleChange, authorName, description}){

    const handleFormChange = (e) => {
        e.preventDefault()
        handleChange(e)
    }

    return(
            <form encType="multipart/form-data">
                <h4>Metadata</h4>
                <label htmlFor="author">{text.addPostForm.authorName}</label>
                <input type="text" name="author" placeholder={text.addPostForm.authorPlaceholder} value={authorName} onChange={handleFormChange} />
                <label htmlFor="description">{text.addPostForm.description}</label>
                <textarea id="description" name="description" placeholder={`(${text.addPostForm.optional})`} value={description} onChange={handleFormChange} />
            </form>
    )
}