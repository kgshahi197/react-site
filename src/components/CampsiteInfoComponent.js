import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, Breadcrumb, Button, BreadcrumbItem,
    Modal, ModalHeader, ModalBody, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';


function RenderCampsite({campsite}) {
        return (
            <div className="col-md-5 m-1">
                <Card>
                    <CardImg top src={campsite.image} alt={campsite.name} />
                    <CardBody>
                        <CardText>{campsite.description}</CardText>
                    </CardBody>
                </Card>
            </div>
        );
    }
    
function RenderComments({comments}) {
            if (comments){
            return (
                <div className="col-md-5 m-1">
                    <h4>Comments</h4>
                    {comments.map(comment => {
                        return(
                            <p key={comment.id}>
                                {comment.text} <br/>
                                {comment.author} {" "} 
                                {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}
                            </p>
                        );
            })}
                <div>
                    <CommentForm></CommentForm>
                </div>
            </div>
            ); 
            }
            return <div/>;
        }

class CommentForm extends Component{
        state = {
            isModalOpen: false,
            touched: { author:false }
        };
        // arrow functions to bind the method to the class since there is no constructor
        toggleModal = () => {
            this.setState({isModalOpen: !this.state.isModalOpen});
        };
        // arrow functions to bind the method to the class since there is no constructor
        handleSubmit = values => {
            // close modal after submit
            this.toggleModal();
            console.log(values);
            alert("Current state is: " + JSON.stringify(values));
        };
        //Passing Local Variables for Validation & Errors
        render() {
        const maxLength = len => val => !val || (val.length <= len);
        const minLength = len => val => val && (val.length >= len);

            return(
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
                            }}/>
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
                            model=".text"/>
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
                            <RenderComments comments={props.comments} />
                        </div>
                    </div>
                );
            }
            return <div />;
            
        }

export default CampsiteInfo;