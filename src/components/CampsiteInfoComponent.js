import React, { Component } from 'react';
import {
    Card, CardImg, CardText, CardBody, Breadcrumb, Button, BreadcrumbItem,
    Modal, ModalHeader, ModalBody, Label
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

function RenderCampsite({ campsite }) {
    return (
        <div className="col-md-5 m-1">
            <FadeTransform
                in
                transformProps={{
                    exitTransform: 'scale(0.5) translateY(-50%)'
                }}>
                <Card>
                    <CardImg top src={baseUrl + campsite.image} alt={campsite.name} />
                    <CardBody>
                        <CardText>{campsite.description}</CardText>
                    </CardBody>
                </Card>
            </FadeTransform>
        </div>
    );
}

function RenderComments({ comments, postComment, campsiteId }) {
    console.log({comments});
    if (comments) {
        return (
            <div className="col-md-5 m-1">
                <h4>Comments</h4>
                <Stagger in>
                    {comments.map(comment => {
                        return (
                            <Fade in key={comment.id}>
                                <div>
                                    <p>{comment.text} <br />
                                        -- {comment.author} {" "},
                                        {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(Date.parse(comment.date)))}
                                    </p>
                                </div>
                            </Fade>
                        );
                    })}
                </Stagger>
                <CommentForm campsiteId={campsiteId} postComment={postComment} />
            </div>
        );
    }
    return <div />;
}

class CommentForm extends Component {
    state = {
        isModalOpen: false,
        touched: { author: false }
    };
    // arrow functions to bind the method to the class since there is no constructor
    toggleModal = () => {
        this.setState({ isModalOpen: !this.state.isModalOpen });
    };
    // arrow functions to bind the method to the class since there is no constructor
    handleSubmit = values => {
        // close modal after submit
        this.toggleModal();
        this.props.postComment(this.props.campsiteId, values.rating, values.author, values.text);
    }


    //Passing Local Variables for Validation & Errors
    render() {
        const maxLength = len => val => !val || (val.length <= len);
        const minLength = len => val => val && (val.length >= len);

        return (
            <div>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Submit Comments</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <Label>Rating</Label>
                                <Control.select className="form-control" id="rating" name="rating" model=".rating">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </Control.select>
                            </div>
                            <div className="form-group">
                                <Label>Author</Label>
                                <Control.text className="form-control" id="author" name="author"
                                    model=".author"
                                    validators={{
                                        minLength: minLength(2),
                                        maxLength: maxLength(15)
                                    }} />
                                <Errors
                                    className="text-danger"
                                    model=".author"
                                    show="touched"
                                    component="div"
                                    messages={{
                                        required: 'Required',
                                        minLength: 'Must be at least 2 characters',
                                        maxLength: 'Must be 15 characters or less'
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <Label>Comment</Label>
                                <Control.text className="form-control" id="text" name="text"
                                    model=".text" />
                            </div>
                            <Button>Submit</Button>
                        </LocalForm>
                    </ModalBody>
                </Modal>

                <Button onClick={this.toggleModal} outline className="fa fa-pencil fa-lg">
                    {' '}
                    Submit Comment
                </Button>
            </div>
        );
    }
}
function CampsiteInfo(props) {
    if (props.isLoading) {
        return (
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    }
    if (props.errMess) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            </div>
        );
    }
    if (props.campsite) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to="/directory">Directory</Link></BreadcrumbItem>
                            <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
                        </Breadcrumb>
                        <h2>{props.campsite.name}</h2>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <RenderCampsite campsite={props.campsite} />
                    <RenderComments
                        comments={props.comments}
                        postComment={props.postComment}
                        campsiteId={props.campsite.id}
                    />
                </div>
            </div>
        );
    }
    return <div />;

}

export default CampsiteInfo;