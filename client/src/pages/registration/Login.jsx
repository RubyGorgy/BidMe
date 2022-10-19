import "./login.css"
import { Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginFailure, loginStart, selectFetching, updateUserData } from "../../redux/slicers/UserSlice";
import { publicRequest } from "../../requestMethods";


const Login = () => {
    let windoWidth = window.innerWidth;

    const schema = Yup.object().shape({
        email: Yup.string().email().required("Please enter your email"),
        password: Yup.string()
        .required("Please enter a password")
        .min(2, "Password is too short")
        .matches(/[a-zA-Z0-9]/, "Invalid character"),
    })
    
    const [error, setError] = useState(false)
    const [message, setMessage] = useState("")
    const [passwordType, setPasswordType] = useState("password");

    const { isFetching } = useSelector(selectFetching)

    const navigate = useNavigate();
    
    const togglePassword = () => {
        if (passwordType === "password") {
            setPasswordType("text")
            return;
        }
        setPasswordType("password")
    }

    const login = (value) => {
        dispatch(loginStart())
        publicRequest.post('/api/login', value)
            .then((res) => {
                const data = res.data
                data && 
                setError(data.error)
                setMessage(data.message)
                if(!data.error){
                    const {avatar, email, firstName, lastName, password, CreditCard, _id, } = data.userData
                    const accessToken = data.accessToken
                    const values = {
                        avatar,
                        email,
                        firstName,
                        lastName,
                        password,
                        _id,
                        accessToken,
                        CreditCard,
                        loggedIn: true
                    }
                    console.log(values);
                    dispatch(updateUserData(values));
                    return navigate("/")
                }else if (data.error){
                    dispatch(loginFailure())
                    console.log("im in error");
                }
            })
            .catch((err) => {console.log(err)});
    }
    const dispatch = useDispatch();

    const handleSubmition = (values) => {
        login(values)
    }

    return (
        <>
        <div className="home-background"/>
        <div className="login-page-container">
            {error && (
                <div className="alert alert-danger invalid-login-alert" role="alert" hidden={!error}>
                    {message}
                </div>
            )}
            <div className="row">
                {windoWidth > 900 &&
                    <div className="background-container">
                        <div className="teaser-container"/>
                    </div>
                }
                <div className="right-side-container">
                    <div className="login-container">
                        <div className="form-contianer">
                            <h1 className="mt-4 pt-2">Sign in</h1>
                            <p>use your auction account</p>

                            <Formik
                                initialValues={{
                                    email: "",
                                    password: ""
                                }}
                                validationSchema={schema}
                                onSubmit={(values) => handleSubmition(values)}>
                                {({ handleSubmit, handleChange, handleBlur, values, errors, touched }) => (
                                    <form onSubmit={handleSubmit} noValidate>
                                        <div className="form-floating mb-3">
                                            <input name="email" type="text" className="form-control" id="floatingInput" placeholder="username, email, or mobile" onChange={handleChange} value={values.email} onBlur={handleBlur} />
                                            <label htmlFor="floatingInput">Username, email, or mobile</label>
                                            <p className="error-message">{errors.email && touched.email && errors.email}</p>
                                        </div>
                                        <div className="form-floating password-input-contianer">
                                            <input name="password" type={passwordType} className="form-control password-input" id="floatingInput" placeholder="Password" onChange={handleChange} value={values.password} onBlur={handleBlur} />
                                            <label htmlFor="floatingInput">Password</label>
                                            <button type="button" className="btn btn-outline-secondary eye-button" onClick={togglePassword}>
                                                {passwordType === "password" ? <FontAwesomeIcon icon="fa-eye" /> : <FontAwesomeIcon icon="fa-eye-slash" />}
                                            </button>
                                        </div>
                                            <p className="error-message">{errors.password && touched.password && errors.password}</p>
                                        <button type="submit"  disabled={isFetching} className="btn btn-primary mb-3">LOGIN</button>
                                        <div className="forgot-password-contianer">
                                            <div className="stay-signed-container">
                                                <input className="form-check-input mt-0" type="checkbox" value="" />
                                                <p className="mb-0 ms-2">Stay signed in</p>
                                            </div>
                                            <p className="mb-0">Forgot your password?</p>
                                        </div>
                                        <Link to="/signup">
                                            <button type="button" className="btn btn-outline-primary mt-3">Create an account</button>
                                        </Link>
                                        <p className="mb-2 mt-2">Or, continue with</p>
                                        <button type="button" className="btn btn-outline-secondary mb-5">Google</button>
                                    </form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}
export default Login