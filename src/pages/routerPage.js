import React, { Component } from 'react';
// import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from '../plugins/KRouter';
import { connect } from 'react-redux';
// import { connect } from '../plugins/KReduxReact';
import { Button } from 'antd';

export default class RouterPage extends Component {
    render() {
        return (
            <div>
                <h3>RouterPage</h3>
                <Router>
                    <div>
                        <Link to="/">首页</Link>
                        <span> | </span>
                        <Link to="/user">用户中心</Link>
                        <span> | </span>
                        <Link to="/search/123">搜索页面</Link>
                    </div>


                    <Switch>
                        <Route exact path="/" component={HomePage} />
                        <ProvideRouter path="/user" component={UsePage} />
                        <Route path="/search/:id" component={SearchPage} />
                        <Route path="/login" component={LoginPages} />
                        <Route render={() => <div>404</div>} />
                    </Switch>
                </Router>
            </div>
        )
    }
}

class UsePage extends Component {
    render() {
        return (
            <div>
                usePage
            </div>
        )
    }
}

class HomePage extends Component {
    render() {
        return (
            <div>
                homePage
            </div>
        )
    }
}

class SearchPage extends Component {
    render() {
        const { match } = this.props;
        return (
            <div>
                <p>searchPage-{match.params.id}</p>
                <Router>
                    <Link to={`/search/${match.params.id}/detail`}>详情</Link>
                    <Route path="/search/:id/detail" component={SratchDetailPage} />
                </Router>
            </div>
        )
    }
}

class SratchDetailPage extends Component {
    render() {
        const { match } = this.props;
        return (
            <div>
                SearchDetailPage-{match.params.id}
            </div>
        )
    }
}

// 路由守卫
const ProvideRouter = connect(
    state => ({login: state.login}),
    {
        LoginOut: () => ({type: 'LOGINOUT_SUCCESS'})
    }
)(
    class ProvideRouter extends Component {
        render() {
            console.log(this.props, 'Provide');
            const { login, path, component, LoginOut } = this.props;
            const { isLogin } = login;
    
            if (isLogin) {
                return <div>
                    <Router path={path} component={component} />
                    <Button onClick={LoginOut}>退出</Button>
                </div>
            }
    
            return (
                <Redirect to={{ pathname: '/login', state: { redirect: path } }} />
            )
        }
    }
)

const LoginPages = connect(
    state => ({login: state.login}),
    {
        // LoginIn: () => ({type: 'LOGININ_SUCCESS'})
        LoginIn: () => ({type: 'LOGININ'})
    }
)(
    class LoginPage extends Component {
        render() {
            console.log(this.props, 'login');
            const { location, login, LoginIn } = this.props;
            const { isLogin } = login;

            const { redirect = '/' } = location.state || {};

            if (isLogin) {
                return <Redirect to={redirect} />
            }

            return (
                <div>
                    <Button onClick={LoginIn}>
                        login
                    </Button>
                </div>
            )
        }
    }
)