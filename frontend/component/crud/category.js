import { useEffect, useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { isAuth, getCookie } from '../../actions/auth';
import { create, getAllCategories, getSingleCategories, removeCategories } from '../../actions/category';


const Category = () => {
  const [values, setValue] = useState({
    name: '',
    error: false,
    success: false,
    categories: [],
    remove: false,
    reload: false
  });

  const { name, error, success, categories, remove, reload } = values;
  const token = getCookie('token');

  useEffect(() => {
    // use effect always require a function to do its task
    loadCategories();
  }, [reload]);


  // function to load category

  const loadCategories = () => {
    getAllCategories().then(data => {
      if (data.error) {
        console.log(data.error);
      }
      else {
        setValue({ ...values, categories: data });
      }
    });
  }

  const showCategories = () => {
    return categories.map((c, i) => {
      return (
        <button onDoubleClick={() => { deleteConfirm(c.slug) }} title="double click to delete" key={i} className="btn btn-outline-primary mr-1 ml-1 mt-3">{c.name}</button>
      );
    });
  }

  const deleteConfirm = (slug) => {
    let answer = window.confirm('Are you sure you want to delete this categoryS');
    if (answer) {
      deleteCategory(slug);
    }
  }

  const deleteCategory = (slug) => {
    removeCategories(slug, token).then(data => {
      if (data.error) {
        console.log(data.error);
      }
      else {
        setValue({ ...values, error: data.error, success: false, remove: !remove, reload: !reload });
      }
    })
  }

  const clickSubmit = (e) => {
    e.preventDefault();
    //backend call for creating  category
    create({ name }, token).then((data, err) => {
      if (data.error) {
        setValue({ ...values, error: data.error, success: false })
      }
      else {
        setValue({ ...values, error: false, success: true, name: '', remove: false, reload: !reload });
      }
    })

  }

  const handleChange = (e) => {
    setValue({ ...values, name: e.target.value, error: false, success: false, remove: '' });
  }


  const showSuccess = () => {
    if (success) {
      return (
        <p className="text-success">Category is created</p>
      );
    }
  }

  const showError = () => {
    if (error) {
      return (
        <p className="text-danger">Category already existed</p>
      );
    }
  }

  const showRemoved = () => {
    if (remove) {
      return (
        <p className="text-info">Category is removed</p>
      );
    }
  }

  const mouseMoveHandler = () => {
    setValue({ ...values,error: false, success: false, remove: '' });
  }

  const newCategoryForm = () => (
    <form onSubmit={clickSubmit}>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input type="text" className="form-control" onChange={handleChange} value={name} required />
        <div className="mt-3">
          <button type="submit" className="btn btn-primary">Create</button>
        </div>
      </div>
    </form>
  );

  return (
    <React.Fragment>
      {showSuccess()}
      {showError()}
      {showRemoved()}
      <div onMouseMove={mouseMoveHandler}>
        {newCategoryForm()}
        {showCategories()}
      </div>
    </React.Fragment>
  )

}

export default Category