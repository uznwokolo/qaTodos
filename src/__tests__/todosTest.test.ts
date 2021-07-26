import {
    Builder,
    By,
    Capabilities,
    until,
    WebDriver,
    WebElement,
    Key,
} from "selenium-webdriver";
import { Driver } from "selenium-webdriver/chrome";
import { elementLocated, elementIsVisible } from "selenium-webdriver/lib/until";

const chromedriver = require("chromedriver");

// The driver
const webd = new Builder().withCapabilities(Capabilities.chrome()).build();

// Test data
const stodo1: string = "Polish shoes";
const stodo2: string = "Buy carrots";
const stodo3: string = "Rent a movie";
var thereAreTodos: boolean;
//var todoArray: Array<WebElement>;


/** A page object for the QA Todos project */
class TodoPage {
    driver: WebDriver;
    appTitle: By = By.css('h1');
    newTodoInput: By = By.css('.new-todo');
    listOfTodos: By = By.css('.todo-list');
    oneTodo: By = By.css('.todo');
    clearCompleted: By = By.css('.clear-completed');
    todoCount: By = By.css('.todo-count');
    checkComplete: By = By.xpath('//input[@class="toggle"]')
    completedTodo: By = By.css('.todo.completed');
    starTodoBtn: By = By.css('.star');
    starredTodo: By = By.css('.starred');
    homeUrl: string = "https://devmountain.github.io/qa_todos/";
    

    constructor(drive: WebDriver) {
        this.driver = drive;
    }

    async openApp() {
        await this.driver.get(this.homeUrl);
    }

    async quit() {
        await this.driver.quit();
    }

    /*async addTodo(value: string) {
        
        //await this.driver.wait(until.elementLocated(tpg.oneTodo));
    }*/

    async markComplete() {
        await tpg.driver.findElement(tpg.checkComplete).click();
    }

    async clearCompletedTodos() {
        await tpg.driver.findElement(tpg.clearCompleted).click();
    }

}

const tpg = new TodoPage(webd);


describe("the todo app", () => {
    beforeEach(async () => {
        await tpg.openApp();
    });
    afterAll(async () => {
        await tpg.quit();
    });
    it('Get app title with POM', async () => {
        let appTitle = await tpg.driver.findElement(tpg.appTitle).getText()
        expect(appTitle).toBe("M I T Todo");
    });
    it('Get the current URL', async () => {
        let appUrl = await tpg.driver.getCurrentUrl();
        expect(appUrl).toBe(tpg.homeUrl);
    });
    it("can add a new todo", async () => {
        await tpg.driver.wait(until.elementLocated(tpg.newTodoInput));
        await tpg.driver.findElement(tpg.newTodoInput).sendKeys(stodo1, Key.ENTER);
        let todo = await tpg.driver.wait(until.elementLocated(tpg.oneTodo)).getAttribute("innerText");;
        expect(todo).toBe(stodo1);
    });
    it("can remove a todo", async () => { 
        // check if input for todo is onscreen
        await tpg.driver.wait(until.elementLocated(tpg.newTodoInput));
        // clear the todo that is in the list
        await tpg.driver.findElement(tpg.checkComplete).click();
        await tpg.driver.findElement(tpg.clearCompleted).click();
        // wait for 1 second
        await tpg.driver.sleep(1000);
        try {
            thereAreTodos = await tpg.driver.findElement(tpg.oneTodo).isDisplayed();
            // noSuchElementError is thrown if element doesn't exist
        }
        catch {
            thereAreTodos = false;
        }
        expect(thereAreTodos).not.toBe(true);
    });
    it("can mark todo with a star", async () => {
        await tpg.driver.wait(until.elementLocated(tpg.newTodoInput));
        await tpg.driver.findElement(tpg.newTodoInput).sendKeys(stodo3, Key.ENTER);
        await tpg.driver.wait(until.elementLocated(tpg.oneTodo));
        // click the star of the new todo in the list
        await tpg.driver.findElement(tpg.starTodoBtn).click();
        // check if any elements with starred class appears onscreen
        let starred = await tpg.driver.wait(until.elementLocated(tpg.starredTodo)).isDisplayed();
        //let starred = await tpg.driver.findElement(tpg.starredTodo).isDisplayed();
        expect(starred).toBe(true);
        // clear the todo that is in the list
        await tpg.driver.findElement(tpg.checkComplete).click();
        await tpg.driver.findElement(tpg.clearCompleted).click();
    });
    it("has the right number of todos listed", async () => {
        await tpg.driver.wait(until.elementLocated(tpg.newTodoInput));
        await tpg.driver.findElement(tpg.newTodoInput).sendKeys(stodo1, Key.ENTER);
        await tpg.driver.findElement(tpg.newTodoInput).sendKeys(stodo2, Key.ENTER);
        await tpg.driver.findElement(tpg.newTodoInput).sendKeys(stodo3, Key.ENTER);
        // wait for 1 second
        await tpg.driver.sleep(1000);
        // return the contents of 'todo-count' element
        let tcount = await tpg.driver.wait(until.elementLocated(tpg.todoCount)).getAttribute("innerText");
        expect(tcount).toBe("3 items left");
    });
});